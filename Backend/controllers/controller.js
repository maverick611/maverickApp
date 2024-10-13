const pool = require('../database'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

// const auth = async (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'No token provided' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.id; 
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
// };


//authentication token verification function
const auth = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const blacklistedToken = await pool.query(
            'SELECT * FROM blacklisted_tokens WHERE token = $1',
            [token]
        );

        if (blacklistedToken.rows.length > 0) {
            return res.status(401).json({ error: 'Token is invalidated. Please log in again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};





// Login function
const login = async (req, res) => {
    const { username, password } = req.body; 
    try {

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);


        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' }); 
        }

        const user = result.rows[0];

        // console.log(user);
        // console.log(password);
        // console.log(user.password);
        const comparePasswords = await bcrypt.compare(password, user.password);
        // console.log(comparePasswords);


        if (!comparePasswords) {
            return res.status(401).json({ error: 'Invalid password' }); 
        }

        const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET);

        res.status(200).json({ message: 'Login successful' ,
            userID : user.user_id,
            token
            }); 

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ error: 'Server Error' }); 
    }
};

let newUserDetails = null;


// Signup function
const signup = async (req, res) => {
    const { firstName, lastName, username, phoneNumber, password, dateOfBirth, email } = req.body;



    //comment ou if checked in frontend
    // if (password !== confirmPassword){
    //     return res.status(400).json({error:'Passwords do not match'});
    // }
    try{
        const existingEmail = pool.query('SELECT * from users where email = $1', [email]);

        // console.log(existingEmail)
        // console.table(existingEmail)

        if ((await existingEmail).rows.length > 0){
            return res.status(409).json({error:"Email is already registered"});
        }

        const existingUsername = pool.query('SELECT * from users where username = $1', [username]);


        if ((await existingUsername).rows.length > 0){
            return res.status(409).json({error:"Please use different username"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        newUserDetails = {
            firstName,
            lastName,
            username,
            phoneNumber,
            hashedPassword,
            dateOfBirth,
            email
        };

        return res.status(200).json({ message: 'User created successfully. codes sent to email and phone.' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};




const confirmationCodes = {
    phoneCode: "123456",
    emailCode: "123456" 
};



// Confirm signup
const confirm_signup = async (req, res) => {
    const { phoneCode, emailCode } = req.body;

    if (phoneCode === confirmationCodes.phoneCode && emailCode === confirmationCodes.emailCode) {
        if (!newUserDetails) {
            return res.status(400).json({ error: "Something is wrong" });
        }

        try {
            const newUser = await pool.query(
                'INSERT INTO users (first_name, last_name, username, phone, password, dob, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
                [
                    newUserDetails.firstName,
                    newUserDetails.lastName,
                    newUserDetails.username,
                    newUserDetails.phoneNumber,
                    newUserDetails.hashedPassword,
                    newUserDetails.dateOfBirth,
                    newUserDetails.email
                ]
            );

            const token = jwt.sign({ id: newUser.rows[0].user_id }, process.env.JWT_SECRET);


            newUserDetails = null;

            return res.status(200).json({
                message: "Email and phone successfully confirmed.",
                userID: newUser.rows[0].user_id,
                token
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    } else {
        return res.status(400).json({
            error: "Invalid confirmation codes provided."
        });
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
                d.disease_name,
                o.options_id AS option_id,
                o.options AS option_text
            FROM 
                questions q
            LEFT JOIN 
                options o ON q.question_id = o.question_id
            LEFT JOIN 
                questions_disease_weightage w ON o.options_id = w.options_id AND q.question_id = w.question_id
            LEFT JOIN 
                chronic_diseases d ON w.disease_id = d.disease_id
            ORDER BY 
                q.question_id, w.disease_id
        `);


        const questionsArray = [];
        result.rows.forEach(row => {

            let questionEntry = questionsArray.find(q => q.question_id === row.question_id);

            if (!questionEntry) {

                questionEntry = {
                    question_id: row.question_id,
                    question: row.question,
                    options: [],
                    type: row.question_type,
                    diseases: [] 
                };
                questionsArray.push(questionEntry);
            }

            const optionExists = questionEntry.options.some(option => option.text === row.option_text);
            if (!optionExists) {
                questionEntry.options.push({
                    id: row.option_id,
                    text: row.option_text
                });
            }

            const diseaseEntry = {
                disease_id: row.disease_id,
                disease_name: row.disease_name
            };

            if (!questionEntry.diseases.some(d => d.disease_id === row.disease_id)) {
                questionEntry.diseases.push(diseaseEntry);
            }
        });

        questionsArray.forEach(question => {
            question.diseases = question.diseases.map(d => ({
                disease_id: d.disease_id,
                disease_name: d.disease_name
            }));
        });

        res.status(200).json(questionsArray);
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




//responses function

const questionnaire_responses = async (req, res) => {
    const { responses } = req.body;
    const user_id = req.userId;

    try {
        const submissionResult = await pool.query(
            'INSERT INTO submissions (user_id, timestamp) VALUES ($1, NOW()) RETURNING submission_id',
            [user_id]
        );

        const submission_id = submissionResult.rows[0].submission_id;

        const diseaseWeights = {};
        const totalWeights = {}; 

        for (const response of responses) {
            const { question_id, options_selected } = response;

            const weightQuery = `
                SELECT 
                    w.disease_id, 
                    d.disease_name,
                    w.weightage,
                    o.options AS option_text
                FROM 
                    questions_disease_weightage w
                JOIN 
                    chronic_diseases d ON w.disease_id = d.disease_id
                JOIN 
                    options o ON w.options_id = o.options_id
                WHERE 
                    w.question_id = $1 AND o.options = ANY($2::text[])
            `;
            const weightValues = await pool.query(weightQuery, [question_id, options_selected]);

            weightValues.rows.forEach(row => {
                const { disease_id, disease_name, weightage } = row;

                if (!diseaseWeights[disease_id]) {
                    diseaseWeights[disease_id] = {
                        disease_name,
                        selected_weights: 0
                    };
                }
                diseaseWeights[disease_id].selected_weights += weightage;

                if (!totalWeights[disease_id]) {
                    totalWeights[disease_id] = {
                        total_weight: 0
                    };
                }
                totalWeights[disease_id].total_weight += weightage;
            });

            for (const option of options_selected) {
                await pool.query(
                    'INSERT INTO responses (question_id, answer, submission_id) VALUES ($1, $2, $3)',
                    [question_id, option, submission_id]
                );
            }
        }

        const responseArray = Object.keys(diseaseWeights).map(disease_id => {
            const { disease_name, selected_weights } = diseaseWeights[disease_id];
            const total_weight = totalWeights[disease_id]?.total_weight || 1;
            const risk_score = selected_weights / total_weight;

            return {
                disease_id,
                disease_name,
                risk_score
            };
        });

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};




// logout function
const logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    try {
        await pool.query(
            'INSERT INTO blacklisted_tokens (token) VALUES ($1)',
            [token]
        );
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


//home information function

const home = async (req, res) => {
    try {

        const linkResult = await pool.query(`
            SELECT resource_link FROM resources WHERE resources_desc = 'Maverick Web Link' AND status = 'active'
        `);
        const maverick_web_link = linkResult.rows.length ? linkResult.rows[0].resource_link : '';


        const contentResult = await pool.query(`
            SELECT hc.display_name, hc.title, r.resource_link
            FROM home_content hc
            LEFT JOIN resources r ON hc.resource_id = r.resource_id
            WHERE hc.status = 'active'
            ORDER BY hc.display_order
        `);

        const display_content = {};
        contentResult.rows.forEach(row => {
            display_content[row.display_name] = {
                title: row.title,
                resource_link: row.resource_link  
            };
        });

        res.status(200).json({
            maverick_web_link,
            display_content
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





//reports functionm

const reports = async (req, res) => {
    const user_id = req.userId; 

    try {
        const submissionsResult = await pool.query(`
            SELECT submission_id, "timestamp"
            FROM submissions
            WHERE user_id = $1
            ORDER BY "timestamp" DESC
            LIMIT 10
        `, [user_id]);

        const responseArray = await Promise.all(submissionsResult.rows.map(async (submission) => {
            const responsesResult = await pool.query(`
                SELECT question_id, answer
                FROM responses
                WHERE submission_id = $1
            `, [submission.submission_id]);

            const diseaseWeights = {};
            const totalWeights = {};

            for (const response of responsesResult.rows) {
                const { question_id, answer } = response;

                const weightQuery = `
                    SELECT w.disease_id, d.disease_name, w.weightage
                    FROM questions_disease_weightage w
                    JOIN chronic_diseases d ON w.disease_id = d.disease_id
                    JOIN options o ON w.options_id = o.options_id
                    WHERE w.question_id = $1 AND o.options = $2
                `;
                
                const weightValues = await pool.query(weightQuery, [question_id, answer]);

                weightValues.rows.forEach(row => {
                    const { disease_id, disease_name, weightage } = row;

                    if (!diseaseWeights[disease_id]) {
                        diseaseWeights[disease_id] = {
                            disease_name,
                            selected_weights: 0,
                            total_weight: 0
                        };
                    }

                    diseaseWeights[disease_id].selected_weights += weightage;

                    diseaseWeights[disease_id].total_weight += weightage; 
                });
            }

            const riskAssessments = Object.keys(diseaseWeights).map(disease_id => {
                const { disease_name, selected_weights, total_weight } = diseaseWeights[disease_id];
                const risk_score = total_weight ? selected_weights / total_weight : 0; 

                return {
                    disease_id,
                    disease_name,
                    risk_score
                };
            });

            return {
                submission_id: submission.submission_id,
                timestamp: submission.timestamp,
                risk_assessments: riskAssessments 
            };
        }));

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




//function for retrieving information for a certain submission

const get_submission = async (req, res) => {
    const { submission_id } = req.body; 

    try {
        const responsesResult = await pool.query(`
            SELECT r.question_id, q.question, r.answer
            FROM responses r
            JOIN questions q ON r.question_id = q.question_id
            WHERE r.submission_id = $1
            ORDER BY r.question_id
        `, [submission_id]);

        if (responsesResult.rows.length === 0) {
            return res.status(404).json({ message: 'No responses found for this submission ID.' });
        }

        const responseMap = {};

        responsesResult.rows.forEach(response => {
            const { question_id, question, answer } = response;

            if (!responseMap[question_id]) {
                responseMap[question_id] = {
                    question_id,
                    question,
                    answers: [] 
                };
            }

            responseMap[question_id].answers.push(answer);
        });

        const responseArray = Object.values(responseMap);

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};






module.exports = {login, signup, logout, confirm_signup, auth, questionnaire, questionnaire_responses, home, reports, get_submission};


