const pool = require('../database'); // Database connection
// const bcrypt = require('bcrypt'); // For password hashing
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
        // Query the user based on email
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' }); // User not found
        }
        // Compare the plain text password directly
        if (user.rows[0].password !== password) {
            return res.status(401).json({ error: 'Invalid password' }); // Invalid password
        }
        res.status(200).json({ message: 'Login successful' }); // Successful login
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
};


module.exports = {login};


