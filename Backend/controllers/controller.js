const con = require('../database');  // Import the PostgreSQL database connection

// Add resource to the database
const addResource = (req, res) => {
    const { disease_name, resources_desc, resource_link, resources_title } = req.body;

    // Function to generate a unique random number for disease_resources
    const generateUniqueId = () => Math.floor(Math.random() * 1000000);

    // Check if the disease exists in chronic_diseases table
    const disease_query = `SELECT disease_id FROM chronic_diseases WHERE disease_name = $1`;

    con.query(disease_query, [disease_name], (err, result) => {
        if (err) {
            console.error("Error fetching disease:", err.stack);
            return res.status(500).json({ error: "Internal server error while fetching disease" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Disease not found" });
        }

        const disease_id = result.rows[0].disease_id;

        // Insert the resource into the resources table without manually generating resource_id
        const insert_resource_query = `
            INSERT INTO resources (resources_desc, resource_link, resources_title, status)
            VALUES ($1, $2, $3, 'active') RETURNING resource_id`;

        const resource_values = [resources_desc, resource_link, resources_title];

        con.query(insert_resource_query, resource_values, (err, resourceResult) => {
            if (err) {
                console.error("Error inserting resource:", err.stack);
                return res.status(500).json({ error: "Internal server error while adding resource" });
            }

            const resource_id = resourceResult.rows[0].resource_id; // Get the generated resource_id
            const disease_resource_id = generateUniqueId();

            // Insert the relationship between disease and resource into the disease_resources table
            const insert_disease_resource_query = `
                INSERT INTO disease_resources (disease_resource_id, disease_id, resource_id)
                VALUES ($1, $2, $3)`;

            con.query(insert_disease_resource_query, [disease_resource_id, disease_id, resource_id], (err) => {
                if (err) {
                    console.error("Error inserting disease-resource relation:", err.stack);
                    return res.status(500).json({ error: "Internal server error while adding disease-resource relation" });
                }

                // Success - return the resource ID and the newly created disease_resource_id
                res.status(201).json({
                    message: "Resource added and linked to disease successfully",
                    resource_id: resource_id,
                    disease_resource_id: disease_resource_id
                });
            });
        });
    });
};



const fetchResources = (req, res) => {
    const resources_query = `
        SELECT 
            r.resource_id, 
            r.resources_desc, 
            r.resource_link, 
            r.resources_title, 
            r.status, 
            cd.disease_name AS disease
        FROM 
            resources r
        JOIN 
            disease_resources dr 
        ON 
            r.resource_id = dr.resource_id
        JOIN 
            chronic_diseases cd 
        ON 
            dr.disease_id = cd.disease_id
        WHERE 
            r.status = 'active'
    `;

    con.query(resources_query, (err, result) => {
        if (err) {
            console.error("Error fetching resources with disease names:", err.stack);
            return res.status(500).json({ error: "Internal server error while fetching resources" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No active resources found" });
        }

        // Return the resources along with their associated disease names
        return res.status(200).json(result.rows);
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




const addAdmin = (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Please provide a valid email address" });
    }

    const username = email.split("@")[0];
    const check_email_query = `SELECT * FROM admins WHERE email = $1`;

    con.query(check_email_query, [email], (err, result) => {
        if (err) {
            console.error("Error checking email uniqueness:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.rows.length > 0) {
            return res.status(400).json({ error: "This email is already associated with another admin" });
        }
        const insert_admin_query = `
            INSERT INTO admins (username, email, status)
            VALUES ($1, $2, 'active') RETURNING admin_id, username, email, status`;

        const admin_values = [username, email];

        con.query(insert_admin_query, admin_values, (err, result) => {
            if (err) {
                console.error("Error adding admin:", err.stack);
                return res.status(500).json({ error: "Internal server error while adding admin" });
            }
            const newAdmin = result.rows[0];
            return res.status(201).json({
                message: "Admin added successfully",
                admin: newAdmin
            });
        });
    });
};





//update password
const bcrypt = require('bcryptjs');
const updatePassword = (req, res) => {
    const { admin_id, old_password, new_password } = req.body;

    // Retrieve the admin details based on admin_id
    const query = 'SELECT * FROM admins WHERE admin_id = $1';
    con.query(query, [admin_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error while retrieving admin details" });
        if (result.rowCount === 0) return res.status(404).json({ error: "Admin not found" });

        const admin = result.rows[0];
        const currentPassword = admin.password;

        // If current password is null, allow setting a new password without comparison
        if (!currentPassword) {
            bcrypt.hash(new_password, 10, (err, hashedPassword) => {
                if (err) return res.status(500).json({ error: "Error hashing password" });

                const updateQuery = 'UPDATE admins SET password = $1 WHERE admin_id = $2 RETURNING admin_id, username';
                con.query(updateQuery, [hashedPassword, admin_id], (err, updateResult) => {
                    if (err) return res.status(500).json({ error: "Internal server error while updating password" });

                    return res.status(200).json({
                        message: "Password updated successfully",
                        admin: updateResult.rows[0]
                    });
                });
            });
        } else {
            // Compare the old password with the current password in DB
            bcrypt.compare(old_password, currentPassword, (err, isMatch) => {
                if (err) return res.status(500).json({ error: "Internal server error while comparing passwords" });
                if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

                // If passwords match, hash the new password and update it
                bcrypt.hash(new_password, 10, (err, hashedPassword) => {
                    if (err) return res.status(500).json({ error: "Error hashing password" });

                    const updateQuery = 'UPDATE admins SET password = $1 WHERE admin_id = $2 RETURNING admin_id, username';
                    con.query(updateQuery, [hashedPassword, admin_id], (err, updateResult) => {
                        if (err) return res.status(500).json({ error: "Internal server error while updating password" });

                        return res.status(200).json({
                            message: "Password updated successfully",
                            admin: updateResult.rows[0]
                        });
                    });
                });
            });
        }
    });
};





// Update admin personal details
const adminPersonalDetails = (req, res) => {
    const { admin_id, username, first_name, last_name, email, phone } = req.body;

    // Check if the admin exists based on the admin_id
    const check_query = 'SELECT * FROM admins WHERE admin_id = $1';
    con.query(check_query, [admin_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.rowCount === 0) return res.status(404).json({ error: "Admin not found" });

        // Update query without password and updated_by fields
        const update_query = `
            UPDATE admins 
            SET username = $1, first_name = $2, last_name = $3, email = $4, phone = $5 
            WHERE admin_id = $6
            RETURNING admin_id, username, first_name, last_name, email, phone
        `;
        const values = [username, first_name, last_name, email, phone, admin_id];

        con.query(update_query, values, (err, result) => {
            if (err && err.code === '23505') return res.status(400).json({ error: "Another admin with this email or username already exists." });
            if (err) return res.status(500).json({ error: "Database error while updating details" });

            // Return successful response with updated details
            const updatedAdmin = result.rows[0]; // Get the updated admin details
            res.status(200).json({
                message: "Admin details updated successfully!",
                updated_admin: {
                    admin_id: updatedAdmin.admin_id,
                    username: updatedAdmin.username,
                    first_name: updatedAdmin.first_name,
                    last_name: updatedAdmin.last_name,
                    email: updatedAdmin.email,
                    phone: updatedAdmin.phone
                }
            });
        });
    });
};





// Deactivate an admin
const deleteAdmin = (req, res) => {
    const { username } = req.params;
    
    // Query to deactivate admin and return details
    const update_query = `UPDATE admins 
                          SET status = 'inactive' 
                          WHERE LOWER(username) = LOWER($1) 
                          RETURNING admin_id, username, first_name, last_name, email, phone, status`;

    // Execute the query
    con.query(update_query, [username], (err, result) => {
        if (err) {
            console.error("Error during the update:", err.stack); // Log the detailed error
            return res.status(500).json({ error: "Internal server error" });
        }

        // Check if any row was affected (i.e., admin was found)
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Get the deactivated admin details
        const deactivatedAdmin = result.rows[0];

        // Return success response with the admin details
        return res.status(200).json({
            message: `Admin with username '${username}' has been deactivated`,
            admin: deactivatedAdmin
        });
    });
};



// Add a question
const addQuestion = (req, res) => {
    const { question, question_type, status, disease, options, weightage } = req.body;

    // Validate required fields
    if (!question || !question_type || !disease || !options || !weightage) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Validate options and weightage arrays
    if (!Array.isArray(options) || !Array.isArray(weightage) || options.length !== weightage.length) {
        return res.status(400).json({ error: "Options and weightage must be arrays of the same length" });
    }

    // Query to get disease_id based on disease name
    const disease_query = `SELECT disease_id, disease_name FROM chronic_diseases WHERE disease_name = $1`;

    con.query(disease_query, [disease], (err, diseaseResult) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error while fetching disease" });
        }
        if (diseaseResult.rows.length === 0) {
            return res.status(404).json({ error: "Disease not found" });
        }

        const disease_id = diseaseResult.rows[0].disease_id;
        const disease_name = diseaseResult.rows[0].disease_name;
        const question_id = Math.floor(Math.random() * 1000000);

        // Insert the question into the questions table
        const insert_question_query = `INSERT INTO questions (question_id, question, question_type, status) VALUES ($1, $2, $3, $4) RETURNING *`;

        con.query(insert_question_query, [question_id, question, question_type, status], (err, questionResult) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error while adding question" });
            }

            const question_data = questionResult.rows[0];

            // Insert into question_disease_relation table
            const question_disease_relation_id = Math.floor(Math.random() * 1000000);
            const insert_relation_query = `INSERT INTO question_disease_relation (question_disease_relation_id, question_id, disease_id) VALUES ($1, $2, $3) RETURNING *`;

            con.query(insert_relation_query, [question_disease_relation_id, question_id, disease_id], (err, relationResult) => {
                if (err) {
                    return res.status(500).json({ error: "Internal server error while adding question-disease relation" });
                }

                // Inserting options and weightage
                const insertOptionsAndWeightage = options.map((optionText, index) => {
                    const options_id = Math.floor(Math.random() * 1000000);
                    const questions_disease_weightage_id = Math.floor(Math.random() * 1000000);

                    const optionQuery = `INSERT INTO options (options_id, options, question_id, status) VALUES ($1, $2, $3, 'active') RETURNING *`;
                    const weightageQuery = `INSERT INTO questions_disease_weightage (questions_disease_weightage_id, question_id, disease_id, options_id, weightage) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

                    return con.query(optionQuery, [options_id, optionText, question_id])
                        .then(optionResult => {
                            return con.query(weightageQuery, [questions_disease_weightage_id, question_id, disease_id, options_id, weightage[index]])
                                .then(weightageResult => {
                                    return { option: optionResult.rows[0], weightage: weightageResult.rows[0] };
                                });
                        });
                });

                // Promise to handle the async operations
                Promise.all(insertOptionsAndWeightage)
                    .then((results) => {
                        const addedOptions = results.map(result => ({
                            option_id: result.option.options_id,
                            option_text: result.option.options,
                            weightage: result.weightage.weightage
                        }));

                        // Send response with inserted details
                        return res.status(201).json({
                            message: "Question, options, and weightage added successfully!",
                            question: {
                                question_id: question_data.question_id,
                                question: question_data.question,
                                question_type: question_data.question_type,
                                status: question_data.status,
                            },
                            disease: {
                                disease_id,
                                disease_name
                            },
                            options: addedOptions
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({ error: "Internal server error while adding options or weightage" });
                    });
            });
        });
    });
};








// Edit a question
const editQuestion = (req, res) => {
    const { question_id } = req.params;
    const { question, question_type } = req.body;

    // Validate required fields
    if (!question || !question_type) {
        return res.status(400).json({ error: "Please provide question and question_type" });
    }

    // Check if the question exists and is active
    const check_question_query = `SELECT * FROM questions WHERE question_id = $1 AND status = 'active'`;
    con.query(check_question_query, [question_id], (err, checkResult) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error while checking question status" });
        }
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Active question not found or already inactive" });
        }

        // If the question exists and is active, update the question
        const update_question_query = `UPDATE questions SET question = $1, question_type = $2 WHERE question_id = $3 RETURNING question_id, question, question_type`;
        const values = [question, question_type, question_id];

        con.query(update_question_query, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error while updating question" });
            }

            // Return the updated question details
            const updatedQuestion = result.rows[0];
            res.status(200).json({
                message: "Question updated successfully",
                question: {
                    question_id: updatedQuestion.question_id,
                    question_text: updatedQuestion.question,
                    question_type: updatedQuestion.question_type
                }
            });
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

    // Check if the question exists
    const checkQuestionQuery = `
        SELECT 
            q.question_id, 
            q.question, 
            o.options_id, 
            o.options AS option_text 
        FROM questions q
        LEFT JOIN options o ON q.question_id = o.question_id
        WHERE q.question_id = $1`;

    con.query(checkQuestionQuery, [question_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error while retrieving question and options" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Question not found" });
        }

        const questionDetails = {
            question_id: result.rows[0].question_id,
            question_text: result.rows[0].question,
            options: result.rows.map(row => ({
                option_id: row.options_id,
                option_text: row.option_text
            }))
        };

        // Update the status of the question and its options to 'inactive'
        const updateQuestionStatusQuery = `UPDATE questions SET status = 'inactive' WHERE question_id = $1`;
        con.query(updateQuestionStatusQuery, [question_id], (err) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error while updating question status" });
            }

            // Update the status of related options to 'inactive'
            const updateOptionsStatusQuery = `UPDATE options SET status = 'inactive' WHERE question_id = $1`;
            con.query(updateOptionsStatusQuery, [question_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Internal server error while updating options status" });
                }

                // Return the details of the deactivated question and options
                res.status(200).json({
                    message: "Question and related options marked as inactive.",
                    question: questionDetails
                });
            });
        });
    });
};







// Deactivate an option (mark it as inactive)
const deactivateOption = (req, res) => {
    const { options_id } = req.params;

    // First, retrieve the option details
    const fetchOptionQuery = `SELECT options_id, options AS option_text FROM options WHERE options_id = $1 AND status = 'active'`;
    
    con.query(fetchOptionQuery, [options_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (result.rowCount === 0) return res.status(404).json({ message: "Option not found or already inactive" });

        const optionDetails = result.rows[0]; // Get the option details

        // Now, mark the option as inactive
        const updateOptionQuery = `UPDATE options SET status = 'inactive' WHERE options_id = $1 AND status = 'active'`;
        con.query(updateOptionQuery, [options_id], (err, updateResult) => {
            if (err) return res.status(500).json({ error: "Internal server error while updating option status" });

            // Return the deactivated option details
            res.status(200).json({
                message: "Option status set to inactive successfully",
                option: optionDetails
            });
        });
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
                res.status(201).json({ message: "Option and weightage added successfully", options_id,option_text });
            });
        });
    });
};







// Edit an option's text or weightage
const editOption = (req, res) => {
    const { question_id, disease_id, options_id, option_text, weightage } = req.body;

    // Validate request body
    if (!question_id || !disease_id || !options_id || (!option_text && weightage === undefined)) {
        return res.status(400).json({ error: "Please provide question_id, disease_id, options_id, and at least one of option_text or weightage" });
    }

    // First, check if the option is active
    const check_option_query = `SELECT status FROM options WHERE options_id = $1 AND question_id = $2`;
    con.query(check_option_query, [options_id, question_id], (err, optionResult) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error while checking option status" });
        }
        if (optionResult.rows.length === 0) {
            return res.status(404).json({ error: "Option not found" });
        }

        // Check if option is active
        if (optionResult.rows[0].status !== 'active') {
            return res.status(400).json({ error: "The option is inactive and cannot be edited" });
        }

        // Check if the question is active and has a relationship with the disease
        const check_question_query = `SELECT q.status, qdr.question_disease_relation_id 
            FROM questions q 
            JOIN question_disease_relation qdr ON q.question_id = qdr.question_id 
            WHERE q.question_id = $1 AND qdr.disease_id = $2`;

        con.query(check_question_query, [question_id, disease_id], (err, questionResult) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error while checking question status" });
            }
            if (questionResult.rows.length === 0 || questionResult.rows[0].status !== "active") {
                return res.status(400).json({ error: "The question is either inactive or does not have a relationship with the specified disease." });
            }

            const queries = [];
            const queryValues = [];

            // Update option text if provided
            if (option_text) {
                const update_option_query = `UPDATE options SET options = $1 WHERE options_id = $2 AND question_id = $3`;
                queries.push(update_option_query);
                queryValues.push([option_text, options_id, question_id]);
            }

            // Update weightage if provided
            if (weightage !== undefined) {
                const update_weightage_query = `UPDATE questions_disease_weightage SET weightage = $1 
                    WHERE options_id = $2 AND question_id = $3 AND disease_id = $4`;
                queries.push(update_weightage_query);
                queryValues.push([weightage, options_id, question_id, disease_id]);
            }

            // Execute all queries to update option and weightage
            Promise.all(queries.map((query, index) => con.query(query, queryValues[index])))
                .then(() => {
                    res.status(200).json({ 
                        message: "Option or weightage updated successfully", 
                        option_id: options_id, 
                        option_text, 
                        weightage, 
                        question_id, 
                        disease_id 
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error: "Internal server error while updating option or weightage" });
                });
        });
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


module.exports = {addResource,fetchResources,login,getAdmins,addAdmin,adminPersonalDetails,deleteAdmin,addQuestion,editQuestion,getQuestionsWithDetails,deleteQuestion,deactivateOption,addOption,editOption,getdailyQuestions,getAdminByUsername,updatePassword};


