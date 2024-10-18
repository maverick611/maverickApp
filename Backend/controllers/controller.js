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


// const generateConfirmationCode = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString(); 
// };


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

            const optionsQuery = `
                SELECT 
                    options_id, 
                    options AS option_text 
                FROM 
                    options 
                WHERE 
                    options_id = ANY($1::int[])
            `;
            const optionsResult = await pool.query(optionsQuery, [options_selected]);

            const optionTexts = optionsResult.rows.map(row => row.option_text);

            const weightQuery = `
                SELECT 
                    w.disease_id, 
                    d.disease_name,
                    w.weightage
                FROM 
                    questions_disease_weightage w
                JOIN 
                    chronic_diseases d ON w.disease_id = d.disease_id
                JOIN 
                    options o ON w.options_id = o.options_id
                WHERE 
                    w.question_id = $1 AND o.options = ANY($2::text[])
            `;
            const weightValues = await pool.query(weightQuery, [question_id, optionTexts]);

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
                    totalWeights[disease_id] = { total_weight: 0 };
                }
                totalWeights[disease_id].total_weight += weightage;
            });

            for (const optionText of optionTexts) {
                await pool.query(
                    'INSERT INTO responses (question_id, answer, submission_id) VALUES ($1, $2, $3)',
                    [question_id, optionText, submission_id]
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



//req body:


// {
//     "responses": [
//         {
//             "question_id": 1,
//             "options_selected": [1] //option ids
//         },
//         {
//             "question_id": 2,
//             "options_selected": [3] //option ids
//         }
//     ]
// }


//response body:

// [
//     {
//         "disease_id": "1",
//         "disease_name": "Cardiovascular Disease Risk",
//         "risk_score": 1
//     },
//     {
//         "disease_id": "2",
//         "disease_name": "Diabetes and Metabolic Syndrome Risk",
//         "risk_score": 1
//     },
//     {
//         "disease_id": "9",
//         "disease_name": "Stroke Risk",
//         "risk_score": 1
//     }
// ]






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
            SELECT 
                r.question_id, 
                q.question, 
                q.question_type AS type,
                r.answer, 
                o.options_id AS option_id,
                o.options AS option_text
            FROM 
                responses r
            JOIN 
                questions q ON r.question_id = q.question_id
            JOIN 
                (
                    SELECT DISTINCT ON (question_id, options) options_id, question_id, options 
                    FROM options 
                    ORDER BY question_id, options, options_id
                ) o ON r.question_id = o.question_id
            WHERE 
                r.submission_id = $1
            ORDER BY 
                r.question_id, o.options_id
        `, [submission_id]);

        if (responsesResult.rows.length === 0) {
            return res.status(404).json({ message: 'No responses found for this submission ID.' });
        }

        const responseMap = {};

        responsesResult.rows.forEach(response => {
            const { question_id, question, type, answer, option_id, option_text } = response;

            if (!responseMap[question_id]) {
                responseMap[question_id] = {
                    question_id,
                    question,
                    options: [],
                    type,
                    answer: null
                };
            }

            const isOptionAdded = responseMap[question_id].options.some(opt => opt.id === option_id);
            if (!isOptionAdded) {
                responseMap[question_id].options.push({
                    id: option_id,
                    text: option_text
                });
            }

            if (answer === option_text) {
                responseMap[question_id].answer = {
                    id: option_id,
                    text: answer
                };
            }
        });

        const responseArray = Object.values(responseMap).map(({ question_id, question, options, type, answer }) => ({
            question_id,
            question,
            options: options.map(opt => ({ id: opt.id, text: opt.text })), // Format options with id and text
            type,
            answer
        }));

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//req body

// {
//     "submission_id": "f1665bbe-92c9-4a9d-bca6-3ec1fde53d1e"
// }



//res body 


// [
//     {
//         "question_id": 3,
//         "question": "Do you engage in less than 30 minutes of physical activity daily?",
//         "options": [
//             {
//                 "id": 7,
//                 "text": "yes"
//             },
//             {
//                 "id": 8,
//                 "text": "no"
//             }
//         ],
//         "type": "single_choice",
//         "answer": {
//             "id": 7,
//             "text": "yes"
//         }
//     },
//     {
//         "question_id": 16,
//         "question": "Do you engage in less than 30 minutes of weight-bearing exercise (e.g., walking, running, strength training) daily?",
//         "options": [
//             {
//                 "id": 40,
//                 "text": "yes"
//             },
//             {
//                 "id": 41,
//                 "text": "no"
//             }
//         ],
//         "type": "single_choice",
//         "answer": {
//             "id": 41,
//             "text": "no"
//         }
//     }
// ]


const submission_report = async (req, res) => {
    const { submission_id } = req.body; 

    try {
        const responsesResult = await pool.query(`
            SELECT 
                r.question_id, 
                o.options_id, 
                o.options
            FROM 
                responses r
            JOIN 
                options o ON r.answer = o.options
            WHERE 
                r.submission_id = $1
        `, [submission_id]);

        if (responsesResult.rows.length === 0) {
            return res.status(404).json({ message: 'No responses found for this submission ID.' });
        }

        const diseaseWeights = {};
        const totalWeights = {}; 

        for (const response of responsesResult.rows) {
            const { question_id, options_id } = response;

            const weightQuery = `
                SELECT 
                    w.disease_id, 
                    d.disease_name,
                    w.weightage
                FROM 
                    questions_disease_weightage w
                JOIN 
                    chronic_diseases d ON w.disease_id = d.disease_id
                WHERE 
                    w.question_id = $1 AND w.options_id = $2
            `;
            const weightValues = await pool.query(weightQuery, [question_id, options_id]);

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
        res.status(500).json({ error: 'Internal server error' });
    }
};

// request body :

// {
//     //    "submission_id": "40aacf43-a5d0-4e61-8e56-a0b1b97f827a"
//        "submission_id": "df5deea3-1a8e-4d0c-b217-9f913ace26b4"
// }

// response bocy:

// [
//     {
//         "disease_id": "1",
//         "disease_name": "Cardiovascular Disease Risk",
//         "risk_score": 1
//     },
//     {
//         "disease_id": "2",
//         "disease_name": "Diabetes and Metabolic Syndrome Risk",
//         "risk_score": 1
//     },
//     {
//         "disease_id": "9",
//         "disease_name": "Stroke Risk",
//         "risk_score": 1
//     }
// ]


// daily_questionnaire api

const daily_questionnaire = async (req, res) => {
    try {
        const questionsResult = await pool.query(`
            SELECT 
                q.question_id, 
                q.question,
                q.question_type,
                o.options_id AS id,
                o.options AS text
            FROM 
                questions q
            JOIN 
                question_disease_relation qdr ON q.question_id = qdr.question_id
            JOIN 
                chronic_diseases d ON qdr.disease_id = d.disease_id
            JOIN 
                questions_disease_weightage qdw ON q.question_id = qdw.question_id AND qdw.disease_id = d.disease_id
            JOIN 
                options o ON qdw.options_id = o.options_id
            WHERE 
                d.status = 'active' AND d.disease_name ILIKE '%daily%'
            ORDER BY 
                q.question_id, o.options_id
        `);

        if (questionsResult.rows.length === 0) {
            return res.status(404).json({ message: 'No daily questions found.' });
        }

        const responseMap = {};

        questionsResult.rows.forEach(row => {
            const { question_id, question, question_type, id, text } = row;

            if (!responseMap[question_id]) {
                responseMap[question_id] = {
                    question_id,
                    question,
                    options: [],
                    type: question_type
                };
            }

            responseMap[question_id].options.push({ id, text });
        });

        const responseArray = Object.values(responseMap);

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




// req body:

// nothing new

//response body:
// [
//     {
//         "question_id": 3,
//         "question": "Do you engage in less than 30 minutes of physical activity daily?",
//         "options": [
//             {
//                 "id": 38,
//                 "text": "yes"
//             },
//             {
//                 "id": 39,
//                 "text": "no"
//             }
//         ],
//         "type": "single_choice"
//     },
//     {
//         "question_id": 16,
//         "question": "Do you engage in less than 30 minutes of weight-bearing exercise (e.g., walking, running, strength training) daily?",
//         "options": [
//             {
//                 "id": 40,
//                 "text": "yes"
//             },
//             {
//                 "id": 41,
//                 "text": "no"
//             }
//         ],
//         "type": "single_choice"
//     }
// ]




// responses for daily questions

const daily_questionnaire_responses = async (req, res) => {
    const { responses } = req.body; 
    const user_id = req.userId;

    try {
        const submissionResult = await pool.query(
            'INSERT INTO submissions (user_id, timestamp) VALUES ($1, NOW()) RETURNING submission_id',
            [user_id]
        );

        const submission_id = submissionResult.rows[0].submission_id;

        for (const response of responses) {
            const { question_id, options_selected } = response;

            const optionsQuery = `
                SELECT 
                    options_id, 
                    options AS option_text 
                FROM 
                    options 
                WHERE 
                    options_id = ANY($1::int[])
            `;
            const optionsResult = await pool.query(optionsQuery, [options_selected]);

            const optionTexts = optionsResult.rows.map(row => row.option_text);

            for (const optionText of optionTexts) {
                await pool.query(
                    'INSERT INTO responses (question_id, answer, submission_id) VALUES ($1, $2, $3)',
                    [question_id, optionText, submission_id]
                );
            }
        }
        res.status(200).json({ message: 'Responses submitted successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



//request body 

// {
//     "responses": [
//         {
//             "question_id": 3,
//             "options_selected": [38]
//         },
//         {
//             "question_id": 16,
//             "options_selected": [41]
//         }
//     ]
// }

// response body

//no return, just saves responses in DB



//for daily reports page

const daily_reports = async (req, res) => {
    const user_id = req.userId;

    try {
        const submissionsResult = await pool.query(`
            SELECT 
                s.submission_id,
                s.timestamp
            FROM 
                submissions s
            JOIN 
                responses r ON s.submission_id = r.submission_id
            JOIN 
                questions_disease_weightage qdw ON r.question_id = qdw.question_id
            JOIN 
                chronic_diseases d ON qdw.disease_id = d.disease_id
            WHERE 
                s.user_id = $1 AND d.disease_name ILIKE '%daily%'
            GROUP BY 
                s.submission_id
            ORDER BY 
                MAX(s.timestamp) DESC 
            LIMIT 10
        `, [user_id]);

        const submissions = submissionsResult.rows;

        if (submissions.length === 0) {
            return res.status(404).json({ message: 'No daily submissions found.' });
        }

        const submissionIds = submissions.map(row => row.submission_id);

        const diseaseWeights = {};
        const totalWeights = {};

        const weightQuery = `
            SELECT 
                r.submission_id,
                qdw.disease_id,
                d.disease_name,
                qdw.weightage
            FROM 
                responses r
            JOIN 
                questions_disease_weightage qdw ON r.question_id = qdw.question_id
            JOIN 
                chronic_diseases d ON qdw.disease_id = d.disease_id
            WHERE 
                r.submission_id = ANY($1::uuid[]) AND d.disease_name ILIKE '%daily%'
        `;
        
        const weightValues = await pool.query(weightQuery, [submissionIds]);

        weightValues.rows.forEach(row => {
            const { disease_id, disease_name, weightage, submission_id } = row;

            if (!diseaseWeights[submission_id]) {
                diseaseWeights[submission_id] = {};
            }

            if (!diseaseWeights[submission_id][disease_id]) {
                diseaseWeights[submission_id][disease_id] = {
                    disease_name,
                    selected_weights: 0
                };
            }
            diseaseWeights[submission_id][disease_id].selected_weights += weightage;

            if (!totalWeights[submission_id]) {
                totalWeights[submission_id] = {};
            }
            if (!totalWeights[submission_id][disease_id]) {
                totalWeights[submission_id][disease_id] = {
                    total_weight: 0
                };
            }
            totalWeights[submission_id][disease_id].total_weight += weightage;
        });

        const responseArray = submissions.map(submission => {
            const submission_id = submission.submission_id;
            const timestamp = submission.timestamp;

            const risk_assessments = Object.keys(diseaseWeights[submission_id] || {}).map(disease_id => {
                const { disease_name, selected_weights } = diseaseWeights[submission_id][disease_id];
                const total_weight = totalWeights[submission_id][disease_id]?.total_weight || 1;
                const risk_score = selected_weights / total_weight;

                return {
                    disease_id,
                    disease_name,
                    risk_score
                };
            });

            return {
                submission_id,
                timestamp,
                risk_assessments
            };
        });

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



//request body

//nothing except token

//response body

// [
//     {
//         "submission_id": "f1665bbe-92c9-4a9d-bca6-3ec1fde53d1e",
//         "timestamp": "2024-10-14T04:02:12.125Z",
//         "risk_assessments": [
//             {
//                 "disease_id": "11",
//                 "disease_name": "daily",
//                 "risk_score": 1
//             }
//         ]
//     },
//     {
//         "submission_id": "88e09614-75cb-4156-981c-ae75cb02be13",
//         "timestamp": "2024-10-14T03:58:11.463Z",
//         "risk_assessments": [
//             {
//                 "disease_id": "11",
//                 "disease_name": "daily",
//                 "risk_score": 1
//             }
//         ]
//     },
// ]


//retrieves only daily questions submissions



const daily_get_submission = async (req, res) => {
    const { submission_id } = req.body; 

    try {
        const responsesResult = await pool.query(`
            SELECT 
                r.question_id, 
                q.question, 
                q.question_type AS type,
                r.answer, 
                o.options_id AS option_id,
                o.options AS option_text
            FROM 
                responses r
            JOIN 
                questions q ON r.question_id = q.question_id
            JOIN 
                (
                    SELECT DISTINCT ON (question_id, options) options_id, question_id, options 
                    FROM options 
                    ORDER BY question_id, options, options_id
                ) o ON r.question_id = o.question_id
            JOIN 
                questions_disease_weightage qdw ON r.question_id = qdw.question_id
            JOIN 
                chronic_diseases d ON qdw.disease_id = d.disease_id
            WHERE 
                r.submission_id = $1 AND d.disease_name ILIKE '%daily%'
            ORDER BY 
                r.question_id, o.options_id
        `, [submission_id]);

        if (responsesResult.rows.length === 0) {
            return res.status(404).json({ message: 'No responses found for this submission ID.' });
        }

        const responseMap = {};

        responsesResult.rows.forEach(response => {
            const { question_id, question, type, answer, option_id, option_text } = response;

            if (!responseMap[question_id]) {
                responseMap[question_id] = {
                    question_id,
                    question,
                    options: [],
                    type,
                    answer: null
                };
            }

            const isOptionAdded = responseMap[question_id].options.some(opt => opt.id === option_id);
            if (!isOptionAdded) {
                responseMap[question_id].options.push({
                    id: option_id,
                    text: option_text
                });
            }

            if (answer === option_text) {
                responseMap[question_id].answer = {
                    id: option_id,
                    text: answer
                };
            }
        });

        const responseArray = Object.values(responseMap).map(({ question_id, question, options, type, answer }) => ({
            question_id,
            question,
            options: options.map(opt => ({ id: opt.id, text: opt.text })), 
            type,
            answer
        }));

        res.status(200).json(responseArray);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//req body

// {
//     "submission_id": "f1665bbe-92c9-4a9d-bca6-3ec1fde53d1e"
// }



//res body 


// [
//     {
//         "question_id": 3,
//         "question": "Do you engage in less than 30 minutes of physical activity daily?",
//         "options": [
//             {
//                 "id": 7,
//                 "text": "yes"
//             },
//             {
//                 "id": 8,
//                 "text": "no"
//             }
//         ],
//         "type": "single_choice",
//         "answer": {
//             "id": 7,
//             "text": "yes"
//         }
//     },
//     {
//         "question_id": 16,
//         "question": "Do you engage in less than 30 minutes of weight-bearing exercise (e.g., walking, running, strength training) daily?",
//         "options": [
//             {
//                 "id": 40,
//                 "text": "yes"
//             },
//             {
//                 "id": 41,
//                 "text": "no"
//             }
//         ],
//         "type": "single_choice",
//         "answer": {
//             "id": 41,
//             "text": "no"
//         }
//     }
// ]




//get personal information of a user

const get_personal_info = async (req, res) => {
    const user_id = req.userId; 

    try {
        const userResult = await pool.query(`
            SELECT 
                first_name, 
                last_name, 
                username, 
                email, 
                phone AS phone_number, 
                TO_CHAR(dob, 'YYYY-MM-DD') AS dob
            FROM 
                users
            WHERE 
                user_id = $1
        `, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInfo = userResult.rows[0];
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



//req body

//just auth token

//res body

// {
//     "first_name": "dummy_firstName_6",
//     "last_name": "dummy_lastName_6",
//     "username": "dummy_username_6",
//     "email": "dummy_6@gmail.com",
//     "phone_number": "+1 716-555-0000",
//     "dob": "1990-01-01"
// }



const update_personal_info = async (req, res) => {
    const user_id = req.userId; 
    const { first_name, last_name, username, email, phone_number, dob } = req.body;

    try {
        const usernameCheckResult = await pool.query(`
            SELECT user_id 
            FROM users 
            WHERE username = $1 AND user_id != $2
        `, [username, user_id]);

        if (usernameCheckResult.rows.length > 0) {
            return res.status(409).json({ message: 'Username is already in use. Please choose a different username.' });
        }

        const updateQuery = `
            UPDATE users
            SET 
                first_name = $1, 
                last_name = $2, 
                username = $3, 
                email = $4, 
                phone = $5, 
                dob = $6
            WHERE 
                user_id = $7
            RETURNING 
                first_name, 
                last_name, 
                username, 
                email, 
                phone AS phone_number, 
                TO_CHAR(dob, 'YYYY-MM-DD') AS dob
        `;

        const updatedUser = await pool.query(updateQuery, [
            first_name, 
            last_name, 
            username, 
            email, 
            phone_number, 
            dob, 
            user_id
        ]);

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedInfo = updatedUser.rows[0];

        res.status(200).json(updatedInfo); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

//both req and res have same bodies

// {
//     "first_name": "dummy_firstName_7",
//     "last_name": "dummy_lastName_6",
//     "username": "dummy_username_6",
//     "email": "dummy_6@gmail.com", // Change will require confirmation
//     "password": "Pass@123", // Change will require confirmation
//     "phone_number": "+1 716-555-0000", // Change will require confirmation
//     "dob": "1990-01-01"
// }





// let temporaryUserUpdates = {}; 

// const update_personal_info = async (req, res) => {
//     const user_id = req.userId;
//     const { first_name, last_name, username, email, password, phone_number, dob } = req.body;

//     try {
//         const currentUserResult = await pool.query(`
//             SELECT email, phone AS number, password 
//             FROM users 
//             WHERE user_id = $1
//         `, [user_id]);

//         if (currentUserResult.rows.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const currentUser = currentUserResult.rows[0];
//         console.log('Current User:', currentUser); 
//         console.log('Incoming Request:', req.body); 

//         let requiresConfirmation = false;

//         const updates = {
//             first_name,
//             last_name,
//             username,
//             dob
//         };

//         if (email && email !== currentUser.email) {
//             updates.email = email;
//             requiresConfirmation = true;
//         }
//         if (phone_number && phone_number !== currentUser.number) {
//             updates.number = phone_number;
//             requiresConfirmation = true;
//         }
//         if (password) {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             if (hashedPassword !== currentUser.password) {
//                 updates.password = hashedPassword;
//                 requiresConfirmation = true;
//             }
//         }

//         if (requiresConfirmation) {
//             temporaryUserUpdates[user_id] = updates;

//             const confirmationCodes = {
//                 phoneCode: "123456",
//                 emailCode: "654321"
//             };

//             console.log('Confirmation codes sent to email and phone:', confirmationCodes);

//             return res.status(409).json({ message: 'Confirmation needed for email, phone, or password changes.' });
//         }

//         await pool.query(`
//             UPDATE users 
//             SET first_name = $1, last_name = $2, username = $3, dob = $4
//             WHERE user_id = $5
//         `, [first_name, last_name, username, dob, user_id]);

//         res.status(200).json({ message: 'Personal information updated successfully.' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };



// const confirm_personal_changes = async (req, res) => {
//     const user_id = req.userId; 
//     const { phoneCode, emailCode } = req.body;

//     const confirmationCodes = {
//         phoneCode: "123456",
//         emailCode: "654321" 
//     };

//     if (phoneCode === confirmationCodes.phoneCode && emailCode === confirmationCodes.emailCode) {

//         const updates = temporaryUserUpdates[user_id];

//         if (!updates) {
//             return res.status(400).json({ error: "No updates found or already confirmed." });
//         }

//         try {

//             await pool.query(`
//                 UPDATE users 
//                 SET email = $1, phone = $2, password = $3
//                 WHERE user_id = $4
//             `, [updates.email, updates.number, updates.password, user_id]);

//             delete temporaryUserUpdates[user_id];

//             return res.status(200).json({ message: "Changes confirmed and updated successfully." });
//         } catch (error) {
//             console.error('Error:', error);
//             return res.status(500).json({ error: 'Server error' });
//         }
//     } else {
//         return res.status(400).json({ error: "Invalid confirmation codes provided." });
//     }
// };



module.exports = {login, signup, logout, confirm_signup, auth, questionnaire, questionnaire_responses, home, reports, get_submission, submission_report, 
    daily_questionnaire, daily_questionnaire_responses, daily_reports, daily_get_submission,
    get_personal_info, update_personal_info

};


