const con = require('../database');  // Import the PostgreSQL database connection

// Add resource to the database
const addResource = (req, res) => {
    const { disease_name, resources_desc, resource_link, resources_title } = req.body;

    const generateUniqueId = () => Math.floor(Math.random() * 1000000);

    const disease_query = `SELECT disease_id FROM chronic_diseases WHERE disease_name = $1`;
    con.query(disease_query, [disease_name], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rows.length === 0) return res.status(404).json({ message: "Disease not found" });

        const disease_id = result.rows[0].disease_id;
        const insert_resource_query = `INSERT INTO resources (resources_desc, resource_link, resources_title, status) VALUES ($1, $2, $3, 'active') RETURNING resource_id`;
        const resource_values = [resources_desc, resource_link, resources_title];

        con.query(insert_resource_query, resource_values, (err, resourceResult) => {
            if (err) return res.status(500).json({ error: "Internal server error while adding resource" });
            const resource_id = resourceResult.rows[0].resource_id;
            const disease_resource_id = generateUniqueId();
            const insert_disease_resource_query = `INSERT INTO disease_resources (disease_resource_id, disease_id, resource_id) VALUES ($1, $2, $3)`;

            con.query(insert_disease_resource_query, [disease_resource_id, disease_id, resource_id], (err) => {
                if (err) return res.status(500).json({ error: "Internal server error while adding disease-resource relation" });
                res.status(201).json({ message: "Resource added successfully", resource_id, disease_resource_id });
            });
        });
    });
};

// Fetch resources from the database
const fetchResources = (req, res) => {
    const fetch_query = "SELECT * FROM resources;";
    con.query(fetch_query, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(result.rows);
    });
};

// Admin login function
const login = (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM admins WHERE username = $1 AND password = $2`;
    con.query(query, [username, password], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rows.length > 0) {
            const user = result.rows[0];
            delete user.password;
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(400).json({ message: "Invalid username or password" });
        }
    });
};

// Get all active admins
const getAdmins = (req, res) => {
    const fetch_query = "SELECT * FROM admins WHERE status = 'active'";
    con.query(fetch_query, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(result.rows);
    });
};

// Add an admin
const addAdmin = (req, res) => {
    const { username } = req.body;
    const check_admin_query = `SELECT * FROM admins WHERE username = $1`;

    con.query(check_admin_query, [username], (err, adminResult) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (adminResult.rows.length > 0) {
            const admin = adminResult.rows[0];
            if (admin.status === 'inactive') {
                const reactivate_admin_query = `UPDATE admins SET status = 'active' WHERE username = $1`;
                con.query(reactivate_admin_query, [username], (err) => {
                    if (err) return res.status(500).json({ error: "Internal server error" });
                    res.status(200).json({ message: "Admin reactivated successfully!" });
                });
            } else {
                res.status(400).json({ message: "Admin is already active" });
            }
        } else {
            const user_query = `SELECT * FROM users WHERE username = $1`;
            con.query(user_query, [username], (err, userResult) => {
                if (err) return res.status(500).json({ error: "Internal server error" });
                if (userResult.rows.length === 0) {
                    const insert_admin_query = `INSERT INTO admins (username, first_name, last_name, email, phone, password, status) VALUES ($1, NULL, NULL, NULL, NULL, NULL, 'active') RETURNING admin_id`;
                    con.query(insert_admin_query, [username], (err, result) => {
                        if (err) return res.status(500).json({ error: "Internal server error" });
                        const admin_id = result.rows[0].admin_id;
                        res.status(201).json({ message: "Admin added successfully", admin_id });
                    });
                } else {
                    const user = userResult.rows[0];
                    const insert_admin_query = `INSERT INTO admins (username, first_name, last_name, email, phone, password, status) VALUES ($1, $2, $3, $4, $5, $6, 'active') RETURNING admin_id`;
                    const admin_values = [user.username, user.first_name, user.last_name, user.email, user.phone, user.password];
                    con.query(insert_admin_query, admin_values, (err, result) => {
                        if (err) return res.status(500).json({ error: "Internal server error" });
                        const admin_id = result.rows[0].admin_id;
                        res.status(201).json({ message: "Admin added successfully", admin_id });
                    });
                }
            });
        }
    });
};

// Update admin personal details
const adminPersonalDetails = (req, res) => {
    const { username, first_name, last_name, email, phone, updated_by, password } = req.body;
    const check_query = 'SELECT * FROM admins WHERE username = $1';
    con.query(check_query, [username], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.rowCount === 0) return res.status(404).json({ error: "Admin not found" });
        const update_query = `UPDATE admins SET first_name = $1, last_name = $2, email = $3, phone = $4, updated_by = $5, password = $6 WHERE username = $7`;
        const values = [first_name, last_name, email, phone, updated_by, password, username];
        con.query(update_query, values, (err) => {
            if (err && err.code === '23505') return res.status(400).json({ error: "Another admin with this email already exists." });
            if (err) return res.status(500).json({ error: "Database error while updating details" });
            res.status(200).json({ message: "Admin details updated successfully!" });
        });
    });
};

// Deactivate an admin
const deleteAdmin = (req, res) => {
    const { username } = req.params;
    const update_query = `UPDATE admins SET status = 'inactive' WHERE LOWER(username) = LOWER($1) RETURNING *`;
    con.query(update_query, [username], (err, result) => {
        if (err) return res.status(500).send("Internal server error");
        if (result.rowCount === 0) return res.status(404).send("Admin not found");
        res.status(200).send(`Admin with username '${username}' has been deactivated`);
    });
};

// Add a question to the database
const addQuestion = (req, res) => {
    const { question, question_type, status, disease, options, weightage } = req.body;
    if (!question || !question_type || !disease || !options || !weightage) return res.status(400).json({ error: "Please provide all required fields" });
    if (!Array.isArray(options) || !Array.isArray(weightage) || options.length !== weightage.length) return res.status(400).json({ error: "Options and weightage must be arrays of the same length" });

    const disease_query = `SELECT disease_id FROM chronic_diseases WHERE disease_name = $1`;
    con.query(disease_query, [disease], (err, diseaseResult) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (diseaseResult.rows.length === 0) return res.status(404).json({ error: "Disease not found" });

        const disease_id = diseaseResult.rows[0].disease_id;
        const question_id = Math.floor(Math.random() * 1000000);
        const insert_question_query = `INSERT INTO questions (question_id, question, question_type, status) VALUES ($1, $2, $3, $4)`;

        con.query(insert_question_query, [question_id, question, question_type, status], (err) => {
            if (err) return res.status(500).json({ error: "Internal server error while adding question" });

            const question_disease_relation_id = Math.floor(Math.random() * 1000000);
            const insert_relation_query = `INSERT INTO question_disease_relation (question_disease_relation_id, question_id, disease_id) VALUES ($1, $2, $3)`;

            con.query(insert_relation_query, [question_disease_relation_id, question_id, disease_id], (err) => {
                if (err) return res.status(500).json({ error: "Internal server error while adding question-disease relation" });

                const insertOptionsAndWeightage = options.map((optionText, index) => {
                    const options_id = Math.floor(Math.random() * 1000000);
                    const questions_disease_weightage_id = Math.floor(Math.random() * 1000000);
                    const optionQuery = `INSERT INTO options (options_id, options, question_id, status) VALUES ($1, $2, $3, 'active')`;
                    const weightageQuery = `INSERT INTO questions_disease_weightage (questions_disease_weightage_id, question_id, disease_id, options_id, weightage) VALUES ($1, $2, $3, $4, $5)`;

                    return con.query(optionQuery, [options_id, optionText, question_id])
                        .then(() => con.query(weightageQuery, [questions_disease_weightage_id, question_id, disease_id, options_id, weightage[index]]));
                });

                Promise.all(insertOptionsAndWeightage)
                    .then(() => res.status(201).json({ message: "Question, options, and weightage added successfully!" }))
                    .catch((error) => res.status(500).json({ error: "Internal server error while adding options or weightage" }));
            });
        });
    });
};

// Edit a question
const editQuestion = (req, res) => {
    const { question_id } = req.params;
    const { question, question_type } = req.body;

    if (!question || !question_type) return res.status(400).json({ error: "Please provide question and question_type" });

    const check_question_query = `SELECT * FROM questions WHERE question_id = $1 AND status = 'active'`;
    con.query(check_question_query, [question_id], (err, checkResult) => {
        if (err) return res.status(500).json({ error: "Internal server error while checking question status" });
        if (checkResult.rows.length === 0) return res.status(404).json({ message: "Active question not found or already inactive" });

        const update_question_query = `UPDATE questions SET question = $1, question_type = $2 WHERE question_id = $3`;
        const values = [question, question_type, question_id];

        con.query(update_question_query, values, (err, result) => {
            if (err) return res.status(500).json({ error: "Internal server error while updating question" });
            res.status(200).json({ message: "Question updated successfully" });
        });
    });
};

// Retrieve all questions with details
const getQuestionsWithDetails = (req, res) => {
    const query = `
        SELECT q.question_id, q.question, q.question_type, q.status AS question_status, cd.disease_id, cd.disease_name, 
               o.options_id, o.options AS option_text, o.status AS option_status, qdw.weightage
        FROM questions q 
        JOIN question_disease_relation qdr ON q.question_id = qdr.question_id
        JOIN chronic_diseases cd ON qdr.disease_id = cd.disease_id
        JOIN questions_disease_weightage qdw ON q.question_id = qdw.question_id AND qdw.disease_id = cd.disease_id
        JOIN options o ON qdw.options_id = o.options_id
        WHERE q.status = 'active' AND o.status = 'active'
        ORDER BY q.question_id, cd.disease_id, o.options_id;
    `;

    con.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });

        const questionsMap = {};
        result.rows.forEach(row => {
            if (!questionsMap[row.question_id]) {
                questionsMap[row.question_id] = {
                    question_id: row.question_id,
                    question: row.question,
                    question_type: row.question_type,
                    diseases: []
                };
            }
            let disease = questionsMap[row.question_id].diseases.find(d => d.disease_id === row.disease_id);
            if (!disease) {
                disease = {
                    disease_id: row.disease_id,
                    disease_name: row.disease_name,
                    options: []
                };
                questionsMap[row.question_id].diseases.push(disease);
            }
            disease.options.push({
                options_id: row.options_id,
                option_text: row.option_text,
                weightage: row.weightage,
                status: row.option_status
            });
        });

        const questionsList = Object.values(questionsMap);
        res.status(200).json(questionsList);
    });
};

// Delete a question (mark it as inactive)
const deleteQuestion = (req, res) => {
    const { question_id } = req.params;
    const check_question_query = `SELECT * FROM questions WHERE question_id = $1`;
    con.query(check_question_query, [question_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rows.length === 0) return res.status(404).json({ error: "Question not found" });

        const update_question_status_query = `UPDATE questions SET status = 'inactive' WHERE question_id = $1`;
        con.query(update_question_status_query, [question_id], (err) => {
            if (err) return res.status(500).json({ error: "Internal server error while updating question status" });

            const update_options_status_query = `UPDATE options SET status = 'inactive' WHERE question_id = $1`;
            con.query(update_options_status_query, [question_id], (err) => {
                if (err) return res.status(500).json({ error: "Internal server error while updating options status" });
                res.status(200).json({ message: "Question and related options marked as inactive." });
            });
        });
    });
};

// Deactivate an option (mark it as inactive)
const deactivateOption = (req, res) => {
    const { options_id } = req.params;
    const update_option_query = `UPDATE options SET status = 'inactive' WHERE options_id = $1 AND status = 'active'`;
    con.query(update_option_query, [options_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rowCount === 0) return res.status(404).json({ message: "Option not found or already inactive" });
        res.status(200).json({ message: "Option status set to inactive successfully" });
    });
};

// Add an option with weightage for a question
const addOption = (req, res) => {
    const { question_id, disease_id, option_text, weightage } = req.body;
    if (!question_id || !disease_id || !option_text || weightage === undefined) return res.status(400).json({ error: "Please provide question_id, disease_id, option_text, and weightage" });

    const check_question_query = `SELECT q.status, qdr.question_disease_relation_id FROM questions q JOIN question_disease_relation qdr ON q.question_id = qdr.question_id WHERE q.question_id = $1 AND qdr.disease_id = $2`;
    con.query(check_question_query, [question_id, disease_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rows.length === 0 || result.rows[0].status !== "active") return res.status(400).json({ error: "The question is either inactive or does not have a relationship with the specified disease." });

        const options_id = Math.floor(Math.random() * 1000000);
        const questions_disease_weightage_id = Math.floor(Math.random() * 1000000);
        const insert_option_query = `INSERT INTO options (options_id, options, question_id, status) VALUES ($1, $2, $3, 'active')`;
        con.query(insert_option_query, [options_id, option_text, question_id], (err) => {
            if (err) return res.status(500).json({ error: "Internal server error while adding option" });

            const insert_weightage_query = `INSERT INTO questions_disease_weightage (questions_disease_weightage_id, question_id, disease_id, options_id, weightage) VALUES ($1, $2, $3, $4, $5)`;
            con.query(insert_weightage_query, [questions_disease_weightage_id, question_id, disease_id, options_id, weightage], (err) => {
                if (err) return res.status(500).json({ error: "Internal server error while adding weightage" });
                res.status(201).json({ message: "Option and weightage added successfully", options_id });
            });
        });
    });
};

// Edit an option's text or weightage
const editOption = (req, res) => {
    const { question_id, disease_id, options_id, option_text, weightage } = req.body;
    if (!question_id || !disease_id || !options_id || (!option_text && weightage === undefined)) return res.status(400).json({ error: "Please provide question_id, disease_id, options_id, and at least one of option_text or weightage" });

    const check_question_query = `SELECT q.status, qdr.question_disease_relation_id FROM questions q JOIN question_disease_relation qdr ON q.question_id = qdr.question_id WHERE q.question_id = $1 AND qdr.disease_id = $2`;
    con.query(check_question_query, [question_id, disease_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rows.length === 0 || result.rows[0].status !== "active") return res.status(400).json({ error: "The question is either inactive or does not have a relationship with the specified disease." });

        const queries = [];
        const queryValues = [];

        if (option_text) {
            const update_option_query = `UPDATE options SET options = $1 WHERE options_id = $2 AND question_id = $3`;
            queries.push(update_option_query);
            queryValues.push([option_text, options_id, question_id]);
        }

        if (weightage !== undefined) {
            const update_weightage_query = `UPDATE questions_disease_weightage SET weightage = $1 WHERE options_id = $2 AND question_id = $3 AND disease_id = $4`;
            queries.push(update_weightage_query);
            queryValues.push([weightage, options_id, question_id, disease_id]);
        }

        Promise.all(queries.map((query, index) => con.query(query, queryValues[index])))
            .then(() => res.status(200).json({ message: "Option or weightage updated successfully" }))
            .catch((error) => res.status(500).json({ error: "Internal server error while updating option or weightage" }));
    });
};

// Get questions related to the disease "daily"
const getdailyQuestions = (req, res) => {
    const diseaseName = "daily";
    const disease_query = `SELECT disease_id FROM chronic_diseases WHERE disease_name = $1`;

    con.query(disease_query, [diseaseName], (err, diseaseResult) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (diseaseResult.rows.length === 0) return res.status(404).json({ error: "Disease not found" });

        const disease_id = diseaseResult.rows[0].disease_id;
        const questions_query = `
            SELECT q.question_id, q.question, q.question_type, q.status AS question_status, o.options_id, o.options AS option_text, o.status AS option_status, qdw.weightage
            FROM questions q
            JOIN question_disease_relation qdr ON q.question_id = qdr.question_id
            JOIN options o ON q.question_id = o.question_id
            JOIN questions_disease_weightage qdw ON o.options_id = qdw.options_id AND qdw.disease_id = qdr.disease_id
            WHERE qdr.disease_id = $1 AND q.status = 'active'
            ORDER BY q.question_id, o.options_id;
        `;
        con.query(questions_query, [disease_id], (err, result) => {
            if (err) return res.status(500).json({ error: "Internal server error" });
            if (result.rows.length === 0) return res.status(404).json({ message: "No questions found for the specified disease" });

            const questionsMap = {};
            result.rows.forEach(row => {
                if (!questionsMap[row.question_id]) {
                    questionsMap[row.question_id] = {
                        question_id: row.question_id,
                        question: row.question,
                        question_type: row.question_type,
                        options: []
                    };
                }
                questionsMap[row.question_id].options.push({
                    options_id: row.options_id,
                    option_text: row.option_text,
                    weightage: row.weightage,
                    status: row.option_status
                });
            });
            const questionsList = Object.values(questionsMap);
            res.status(200).json(questionsList);
        });
    });
};



const getAdminByUsername = (req, res) => {
    const { username } = req.params;

    // Check if username is provided
    if (!username) {
        return res.status(400).json({ error: "Please provide a username" });
    }

    // Query to fetch the admin by username
    const query = `SELECT * FROM admins WHERE username = $1 AND status = 'active'`;

    con.query(query, [username], (err, result) => {
        if (err) {
            console.error("Error fetching admin details:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Return the admin details
        return res.status(200).json(result.rows[0]);
    });
};


module.exports = {addResource,fetchResources,login,getAdmins,addAdmin,adminPersonalDetails,deleteAdmin,addQuestion,editQuestion,getQuestionsWithDetails,deleteQuestion,deactivateOption,addOption,editOption,getdailyQuestions,getAdminByUsername};


