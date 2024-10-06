const pool = require('../database'); // Database connection
const bcrypt = require('bcrypt'); // For password hashing
// const jwt = require('jsonwebtoken'); // For generating tokens

// Signup function
// const signup = async (req, res) => {
//   const { username, email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const newUser = await pool.query(
//       'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
//       [username, email, hashedPassword]
//     );
//     res.status(201).json({ user: newUser.rows[0] });
//   } catch (error) {
//     res.status(500).json({ error: 'User registration failed' });
//   }
// };

// Login function
const login = async (req, res) => {
    const { username, password } = req.body; // Get username and password from the request body
    try {

        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' }); // User not found
        }

        if (user.rows[0].password !== password) {
            return res.status(401).json({ error: 'Invalid password' }); // Invalid password
        }
        res.status(200).json({ message: 'Login successful' }); // Successful login
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
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

        const hashedPassword = await bcrypt .hash(password,10);

        const newUser = await pool.query(      'INSERT INTO users (first_name, last_name, username, phone, password, dob, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
            [firstName, lastName, username, phoneNumber, hashedPassword, dateOfBirth, email] // Use hashed password
        );

        // console.log(newUser)
        // console.table(newUser)

        return res.status(200).json({message : 'new user added succesfully',
            userID : newUser.rows[0].user_id,
            });

    }

    catch(error){
        console.error('error',error);
        return res.status(500).json({error:'server error'});   
    }
};



module.exports = {login, signup};


