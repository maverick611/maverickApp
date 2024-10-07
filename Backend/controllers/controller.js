const pool = require('../database'); // Database connection
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens

// authenticate user based on JWT
const auth = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Extract user ID from token
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};




// Login function
const login = async (req, res) => {
    const { username, password } = req.body; // Get username and password from the request body
    try {

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);


        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' }); // User not found
        }

        const user = result.rows[0];

        // console.log(user);
        // console.log(password);
        // console.log(user.password);
        const comparePasswords = await bcrypt.compare(password, user.password);
        // console.log(comparePasswords);


        if (!comparePasswords) {
            return res.status(401).json({ error: 'Invalid password' }); // Invalid password
        }

        const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET,{expiresIn: "1h"});

        res.status(200).json({ message: 'Login successful' ,
            userID : user.user_id,
            token
            }); // Successful login

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ error: 'Server Error' }); // Handle errors
    }
};




// Signup function
const signup = async (req, res) => {
    const { firstName, lastName, username, phoneNumber, password, confirmPassword, dateOfBirth, email } = req.body;

    //comment ou if checked in frontend
    if (password !== confirmPassword){
        return res.status(400).json({error:'passwords dont match'});
    }
    try{
        const existingEmail = pool.query('SELECT * from users where email = $1', [email]);

        // console.log(existingEmail)
        // console.table(existingEmail)

        if ((await existingEmail).rows.length > 0){
            return res.status(409).json({error:"email is already registered"});
        }

        const existingUsername = pool.query('SELECT * from users where phone = $1', [phoneNumber]);


        if ((await existingUsername).rows.length > 0){
            return res.status(409).json({error:"please use different username"});
        }

        const hashedPassword = await bcrypt .hash(password,10);

        const newUser = await pool.query(      'INSERT INTO users (first_name, last_name, username, phone, password, dob, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
            [firstName, lastName, username, phoneNumber, hashedPassword, dateOfBirth, email] // Use hashed password
        );

        // console.log(newUser)
        // console.table(newUser)

        const token = jwt.sign({id: newUser.rows[0].user_id}, process.env.JWT_SECRET,{expiresIn: "1h"});

        return res.status(200).json({message : 'new user added succesfully',
            userID : newUser.rows[0].user_id,
            token
            });

    }

    catch(error){
        console.error('error:',error);
        return res.status(500).json({error:'server error'});   
    }
};





//questionnare function

const questionnaire = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                q.question_id,
                q.question,
                q.question_type,
                w.disease_id,
                jsonb_object_agg(o.options, w.weightage) AS options_weightage
            FROM 
                questions q
            LEFT JOIN 
                options o ON q.question_id = o.question_id
            LEFT JOIN 
                questions_disease_weightage w ON q.question_id = w.question_id AND o.options = w.options
            GROUP BY 
                q.question_id, q.question, q.question_type, w.disease_id
        `);

        const questions = result.rows.map(row => ({
            question_id: row.question_id,
            question: row.question,
            options: row.options_weightage,  
            type: row.question_type,
            disease_id: row.disease_id
        }));

        res.status(200).json(questions); 
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const questionnaire_responses = async (req, res) => {
    const { responses } = req.body;
    const user_id = req.userId; 

    try {
        
        const submissionResult = await pool.query(
            'INSERT INTO submissions (user_id, timestamp) VALUES ($1, NOW()) RETURNING submission_id',
            [user_id]
        );

        const submission_id = submissionResult.rows[0].submission_id; 

        const results = [];


        for (const response of responses) {
            const { question_id, options_selected } = response;


            for (const option of options_selected) {
                await pool.query(
                    'INSERT INTO responses (question_id, answer, submission_id) VALUES ($1, $2, $3)',
                    [question_id, option, submission_id]
                );
            }


            const weightQuery = `
                SELECT options, disease_id, weightage 
                FROM questions_disease_weightage 
                WHERE question_id = $1 AND options = ANY($2::text[])
            `;
            const weightValues = await pool.query(weightQuery, [question_id, options_selected]);

            const optionWeights = {};

            weightValues.rows.forEach(row => {
                const { options, disease_id, weightage } = row;
                optionWeights[options] = weightage; 
                results.push({
                    question_id,
                    options_selected: optionWeights,
                    disease_id,
                    submission_id: submission_id
                });
            });
        }


        res.status(200).json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};





module.exports = {login, signup, auth, questionnaire, questionnaire_responses};


