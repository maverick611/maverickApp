// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/", (req, res) => {
//   res.send("code setup!");
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const {Client}=require('pg')
const express=require('express')
const bcrypt = require('bcryptjs');

const app=express()
app.use(express.json())

const con=new Client ({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"postgres",
    database:"Maverick611"
})
con.connect().then(()=>console.log("connected"))

app.post('/addResource', (req, res) => {
    const { disease_name, resources_desc, resource_link, resources_title } = req.body;

    // Function to generate a unique random number
    const generateUniqueId = () => {
        return Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999,999
    };

    // Check if disease exists in chronic_diseases table
    const disease_query = `SELECT disease_id FROM chronic_diseases WHERE disease_name = $1`;
    
    con.query(disease_query, [disease_name], (err, result) => {
        if (err) {
            console.error("Error fetching disease:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.rows.length === 0) {
            // Disease does not exist
            return res.status(404).json({ message: "Disease not found" });
        }

        // Disease exists, get disease_id
        const disease_id = result.rows[0].disease_id;

        // Insert the resource into the resources table
        const insert_resource_query = `
            INSERT INTO resources (resources_desc, resource_link, resources_title, status)
            VALUES ($1, $2, $3, 'active') RETURNING resource_id`;

        const resource_values = [resources_desc, resource_link, resources_title];

        con.query(insert_resource_query, resource_values, (err, resourceResult) => {
            if (err) {
                console.error("Error inserting resource:", err.stack);
                return res.status(500).json({ error: "Internal server error while adding resource" });
            }

            // Get the newly inserted resource_id
            const resource_id = resourceResult.rows[0].resource_id;

            // Generate a unique disease_resource_id
            const disease_resource_id = generateUniqueId();

            // Insert the relationship between disease and resource into the disease_resources table
            const insert_disease_resource_query = `
                INSERT INTO disease_resources (disease_resource_id, disease_id, resource_id)
                VALUES ($1, $2, $3)`;

            con.query(insert_disease_resource_query, [disease_resource_id, disease_id, resource_id], (err, result) => {
                if (err) {
                    console.error("Error inserting disease-resource relation:", err.stack);
                    return res.status(500).json({ error: "Internal server error while adding disease-resource relation" });
                }

                // Success - return the resource ID and the newly created disease_resource_id
                return res.status(201).json({ 
                    message: "Resource added and linked to disease successfully", 
                    resource_id: resource_id,
                    disease_resource_id: disease_resource_id 
                });
            });
        });
    });
});





app.get('/fetchResources',(req,res)=>{
    const fetch_query="select * from resources;"
    con.query(fetch_query,(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            res.send(result.rows)
        }
    })
})


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM admins WHERE username = $1 AND password = $2`;
    con.query(query, [username, password], (err, result) => {
        if (err) {
            console.error("Internal server error:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Query Result:", result.rows);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            delete user.password;
            return res.status(200).json({
                message: "Login successful",
                user: user
            });
        } else {
            return res.status(400).json({ message: "Invalid username or password" });
        }
    });
});




app.get('/getAdmins', (req, res) => {
    const fetch_query = "SELECT * FROM admins where status ='active'";
    con.query(fetch_query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.rows);
        }
    });
});


app.post('/adminpersonaldetails', (req, res) => {
    const { username, first_name, last_name, email, phone, updated_by, password } = req.body;

    // Check if all required fields are provided
    if (!username || !first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // First, check if the admin exists based on the username
    const check_query = 'SELECT * FROM admins WHERE username = $1';
    
    con.query(check_query, [username], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.rowCount === 0) {
            // If the admin does not exist, return an error
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Admin exists, proceed to update their details
        const update_query = `
            UPDATE admins 
            SET first_name = $1, last_name = $2, email = $3, phone = $4, updated_by = $5, password = $6
            WHERE username = $7`;

        const values = [first_name, last_name, email, phone, updated_by, password, username];

        con.query(update_query, values, (err, result) => {
            if (err) {
                if (err.code === '23505') { // Unique constraint violation (e.g., email already exists)
                    return res.status(400).json({ error: 'Another admin with this email already exists.' });
                }
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error while updating details' });
            }

            return res.status(200).json({ message: 'Admin details updated successfully!' });
        });
    });
});


app.put('/deleteAdmin/:username', (req, res) => {
    const { username } = req.params;

    // Update query to set the status to 'inactive' based on the username
    const update_query = `UPDATE admins SET status = 'inactive' WHERE LOWER(username) = LOWER($1) RETURNING *`;

    con.query(update_query, [username], (err, result) => {
        if (err) {
            console.error("Error executing query", err.stack);
            res.status(500).send("Internal server error");
        } else if (result.rowCount === 0) {
            res.status(404).send("Admin not found");
        } else {
            res.status(200).send(`Admin with username '${username}' has been deactivated`);
        }
    });
});

app.post('/addAdmin', (req, res) => {
    const { username } = req.body;

    // Check if the admin with the given username exists in the admins table
    const check_admin_query = `SELECT * FROM admins WHERE username = $1`;

    con.query(check_admin_query, [username], (err, adminResult) => {
        if (err) {
            console.error("Error checking admin:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (adminResult.rows.length > 0) {
            // Admin with the given username exists
            const admin = adminResult.rows[0];

            if (admin.status === 'inactive') {
                // If the admin exists and is inactive, update the status to 'active'
                const reactivate_admin_query = `
                    UPDATE admins 
                    SET status = 'active'
                    WHERE username = $1`;

                con.query(reactivate_admin_query, [username], (err, result) => {
                    if (err) {
                        console.error("Error reactivating admin:", err.stack);
                        return res.status(500).json({ error: "Internal server error while reactivating admin" });
                    }

                    return res.status(200).json({ message: "Admin reactivated successfully!" });
                });
            } else {
                // If the admin is already active, return a message indicating that
                return res.status(400).json({ message: "Admin is already active" });
            }

        } else {
            // If no admin with the given username exists, check if the user exists in the users table
            const user_query = `SELECT * FROM users WHERE username = $1`;

            con.query(user_query, [username], (err, userResult) => {
                if (err) {
                    console.error("Error fetching user data:", err.stack);
                    return res.status(500).json({ error: "Internal server error" });
                }

                if (userResult.rows.length === 0) {
                    // If the username does not exist in the users table, insert only the username and let PostgreSQL generate the admin_id
                    const insert_admin_query = `
                        INSERT INTO admins (username, first_name, last_name, email, phone, updated_by, password, status)
                        VALUES ($1, NULL, NULL, NULL, NULL, NULL, NULL, 'active') RETURNING admin_id`;

                    con.query(insert_admin_query, [username], (err, result) => {
                        if (err) {
                            console.error("Error inserting admin:", err.stack);
                            return res.status(500).json({ error: "Internal server error while adding admin" });
                        }

                        const admin_id = result.rows[0].admin_id;
                        return res.status(201).json({ message: "Admin added successfully with null values", admin_id });
                    });

                } else {
                    // If username exists in the users table, retrieve the details and insert into the admins table
                    const user = userResult.rows[0]; // Retrieve the first (and only) user record

                    const insert_admin_query = `
                        INSERT INTO admins (username, first_name, last_name, email, phone, updated_by, password, status)
                        VALUES ($1, $2, $3, $4, $5, NULL, $6, 'active') RETURNING admin_id`;

                    const admin_values = [
                        user.username, 
                        user.first_name, 
                        user.last_name, 
                        user.email, 
                        user.phone, 
                        user.password
                    ];

                    con.query(insert_admin_query, admin_values, (err, result) => {
                        if (err) {
                            console.error("Error inserting admin:", err.stack);
                            return res.status(500).json({ error: "Internal server error while adding admin" });
                        }

                        const admin_id = result.rows[0].admin_id;
                        return res.status(201).json({ message: "Admin added successfully with user details", admin_id });
                    });
                }
            });
        }
    });
});


const { v4: uuidv4 } = require('uuid');

app.post('/addQuestion', (req, res) => {
    const { question, question_type, status, disease, options, weightage } = req.body;

    // Check if all required fields are provided
    if (!question || !question_type || !disease || !options || !weightage) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Validate that options and weightage are arrays and have the same length
    if (!Array.isArray(options) || !Array.isArray(weightage) || options.length !== weightage.length) {
        return res.status(400).json({ error: 'Options and weightage must be arrays of the same length' });
    }

    // Retrieve the disease_id based on the disease name from chronic_diseases table
    const disease_query = `SELECT disease_id FROM chronic_diseases WHERE disease_name = $1`;

    con.query(disease_query, [disease], (err, diseaseResult) => {
        if (err) {
            console.error("Error fetching disease data:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (diseaseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Disease not found' });
        }

        const disease_id = diseaseResult.rows[0].disease_id;
        const question_id = Math.floor(Math.random() * 1000000); // Generate a random integer for question_id

        // Insert the question into the questions table
        const insert_question_query = `
            INSERT INTO questions (question_id, question, question_type, status)
            VALUES ($1, $2, $3, $4)`;

        con.query(insert_question_query, [question_id, question, question_type, status], (err) => {
            if (err) {
                console.error("Error inserting question:", err.stack);
                return res.status(500).json({ error: "Internal server error while adding question" });
            }

            // Insert the question-disease relation into question_disease_relation table
            const question_disease_relation_id = Math.floor(Math.random() * 1000000); // Generate a random ID for the relation
            const insert_relation_query = `
                INSERT INTO question_disease_relation (question_disease_relation_id, question_id, disease_id)
                VALUES ($1, $2, $3)`;

            con.query(insert_relation_query, [question_disease_relation_id, question_id, disease_id], (err) => {
                if (err) {
                    console.error("Error inserting question-disease relation:", err.stack);
                    return res.status(500).json({ error: "Internal server error while adding question-disease relation" });
                }

                // Insert each option and its weight into the options and questions_disease_weightage tables
                const insertOptionsAndWeightage = options.map((optionText, index) => {
                    const options_id = Math.floor(Math.random() * 1000000); // Generate a random ID for options
                    const questions_disease_weightage_id = Math.floor(Math.random() * 1000000); // Generate a random ID for weightage

                    const optionQuery = `
                        INSERT INTO options (options_id, options, question_id, status)
                        VALUES ($1, $2, $3, 'active')`;

                    const weightageQuery = `
                        INSERT INTO questions_disease_weightage (questions_disease_weightage_id, question_id, disease_id, options_id, weightage)
                        VALUES ($1, $2, $3, $4, $5)`; // Use options_id instead of options text

                    return con.query(optionQuery, [options_id, optionText, question_id])
                        .then(() => {
                            return con.query(weightageQuery, [questions_disease_weightage_id, question_id, disease_id, options_id, weightage[index]]);
                        });
                });

                // Execute all the queries for options and weightages
                Promise.all(insertOptionsAndWeightage)
                    .then(() => {
                        res.status(201).json({ message: 'Question, options, and weightage added successfully!' });
                    })
                    .catch((error) => {
                        console.error("Error inserting options or weightage:", error.stack);
                        res.status(500).json({ error: 'Internal server error while adding options or weightage' });
                    });
            });
        });
    });
});


app.put('/editQuestion/:question_id', (req, res) => {
    const { question_id } = req.params;
    const { question, question_type } = req.body;

    // Check if required fields are provided
    if (!question || !question_type) {
        return res.status(400).json({ error: 'Please provide question and question_type' });
    }

    // First, check if the question exists and has status 'active'
    const check_question_query = `
        SELECT * FROM questions 
        WHERE question_id = $1 AND status = 'active'`;

    con.query(check_question_query, [question_id], (err, checkResult) => {
        if (err) {
            console.error("Error checking question status:", err.stack);
            return res.status(500).json({ error: 'Internal server error while checking question status' });
        }

        // If no active question is found, return a 404 response
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Active question not found or the question is already inactive' });
        }

        // Update the question in the questions table if it's active
        const update_question_query = `
            UPDATE questions 
            SET question = $1, question_type = $2
            WHERE question_id = $3`;

        const values = [question, question_type, question_id];

        con.query(update_question_query, values, (err, result) => {
            if (err) {
                console.error("Error updating question:", err.stack);
                return res.status(500).json({ error: 'Internal server error while updating question' });
            }

            // Check if any rows were updated
            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Question not found or no changes made' });
            }

            return res.status(200).json({ message: 'Question updated successfully' });
        });
    });
});



app.get('/getQuestionsWithDetails', (req, res) => {
    const query = `
        SELECT 
            q.question_id, 
            q.question, 
            q.question_type, 
            q.status AS question_status,
            cd.disease_id, 
            cd.disease_name,
            o.options_id,
            o.options AS option_text,
            o.status AS option_status,
            qdw.weightage
        FROM questions q 
        JOIN question_disease_relation qdr ON q.question_id = qdr.question_id
        JOIN chronic_diseases cd ON qdr.disease_id = cd.disease_id
        JOIN questions_disease_weightage qdw ON q.question_id = qdw.question_id AND qdw.disease_id = cd.disease_id
        JOIN options o ON qdw.options_id = o.options_id
        WHERE q.status = 'active' AND o.status = 'active'
        ORDER BY q.question_id, cd.disease_id, o.options_id;
    `;

    con.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching questions with details:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const questionsMap = {};

        result.rows.forEach(row => {
            // Check if the question is already in the map
            if (!questionsMap[row.question_id]) {
                questionsMap[row.question_id] = {
                    question_id: row.question_id,
                    question: row.question,
                    question_type: row.question_type,
                    status: row.question_status,
                    diseases: []
                };
            }

            // Find the disease entry or add a new one
            let disease = questionsMap[row.question_id].diseases.find(d => d.disease_id === row.disease_id);
            if (!disease) {
                disease = {
                    disease_id: row.disease_id,
                    disease_name: row.disease_name,
                    options: []
                };
                questionsMap[row.question_id].diseases.push(disease);
            }

            // Add the option to the disease's options list
            disease.options.push({
                options_id: row.options_id,
                option_text: row.option_text,
                status: row.option_status,
                weightage: row.weightage
            });
        });

        // Convert the map to an array
        const questionsList = Object.values(questionsMap);
        return res.status(200).json(questionsList);
    });
});


app.put('/deleteQuestion/:question_id', (req, res) => {
    const { question_id } = req.params;

    // Check if the question exists
    const checkQuestionQuery = `SELECT * FROM questions WHERE question_id = $1`;

    con.query(checkQuestionQuery, [question_id], (err, result) => {
        if (err) {
            console.error("Error checking question:", err.stack);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.rows.length === 0) {
            // Question not found
            return res.status(404).json({ error: "Question not found" });
        }

        // Update the status of the question to 'inactive'
        const updateQuestionStatusQuery = `
            UPDATE questions 
            SET status = 'inactive' 
            WHERE question_id = $1`;

        con.query(updateQuestionStatusQuery, [question_id], (err) => {
            if (err) {
                console.error("Error updating question status:", err.stack);
                return res.status(500).json({ error: "Internal server error while updating question status" });
            }

            // Update the status of related options to 'inactive'
            const updateOptionsStatusQuery = `
                UPDATE options 
                SET status = 'inactive' 
                WHERE question_id = $1`;

            con.query(updateOptionsStatusQuery, [question_id], (err) => {
                if (err) {
                    console.error("Error updating options status:", err.stack);
                    return res.status(500).json({ error: "Internal server error while updating options status" });
                }

                res.status(200).json({ message: "Question and related options have been marked as inactive." });
            });
        });
    });
});


app.put('/deactivateOption/:options_id', (req, res) => {
    const { options_id } = req.params;

    // Check if options_id is provided
    if (!options_id) {
        return res.status(400).json({ error: 'Please provide a valid options_id' });
    }

    // Update the status of the specified option to 'inactive'
    const update_option_query = `
        UPDATE options 
        SET status = 'inactive' 
        WHERE options_id = $1 AND status = 'active'`;

    con.query(update_option_query, [options_id], (err, result) => {
        if (err) {
            console.error('Error updating option status:', err.stack);
            return res.status(500).json({ error: 'Internal server error while updating option status' });
        }

        // Check if any rows were updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Option not found or already inactive' });
        }

        return res.status(200).json({ message: 'Option status set to inactive successfully' });
    });
});

app.post('/addOption', (req, res) => {
  const { question_id, disease_id, option_text, weightage } = req.body;

  // Validate input
  if (!question_id || !disease_id || !option_text || weightage === undefined) {
      return res.status(400).json({ error: 'Please provide question_id, disease_id, option_text, and weightage' });
  }

  // Check if the question is active
  const check_question_query = `
      SELECT q.status, qdr.question_disease_relation_id 
      FROM questions q 
      JOIN question_disease_relation qdr ON q.question_id = qdr.question_id
      WHERE q.question_id = $1 AND qdr.disease_id = $2`;

  con.query(check_question_query, [question_id, disease_id], (err, result) => {
      if (err) {
          console.error("Error checking question status and relationship:", err.stack);
          return res.status(500).json({ error: 'Internal server error while checking question status and relationship' });
      }

      // Check if the question is active and has a relationship with the specified disease
      if (result.rows.length === 0 || result.rows[0].status !== 'active') {
          return res.status(400).json({ 
              error: 'The question is either inactive or does not have a relationship with the specified disease.' 
          });
      }

      // If the question is active and has a relationship with the disease, proceed to add the option
      const options_id = Math.floor(Math.random() * 900000) + 100000; // Random integer between 100000 and 999999
      const questions_disease_weightage_id = Math.floor(Math.random() * 900000) + 100000; // Random integer between 100000 and 999999

      // Insert the option into the options table
      const insert_option_query = `
          INSERT INTO options (options_id, options, question_id, status)
          VALUES ($1, $2, $3, 'active')`;

      con.query(insert_option_query, [options_id, option_text, question_id], (err) => {
          if (err) {
              console.error("Error inserting option:", err.stack);
              return res.status(500).json({ error: 'Internal server error while adding option' });
          }

          // Insert the weightage into the questions_disease_weightage table
          const insert_weightage_query = `
              INSERT INTO questions_disease_weightage (questions_disease_weightage_id, question_id, disease_id, options_id, weightage)
              VALUES ($1, $2, $3, $4, $5)`;

          con.query(insert_weightage_query, [questions_disease_weightage_id, question_id, disease_id, options_id, weightage], (err) => {
              if (err) {
                  console.error("Error inserting weightage:", err.stack);
                  return res.status(500).json({ error: 'Internal server error while adding weightage' });
              }

              return res.status(201).json({ message: 'Option and weightage added successfully', options_id });
          });
      });
  });
});

app.put('/editOption', (req, res) => {
  const { question_id, disease_id, options_id, option_text, weightage } = req.body;

  // Validate input
  if (!question_id || !disease_id || !options_id || (!option_text && weightage === undefined)) {
      return res.status(400).json({ error: 'Please provide question_id, disease_id, options_id, and at least one of option_text or weightage' });
  }

  // Check if the question is active and has a relationship with the specified disease
  const check_question_query = `
      SELECT q.status, qdr.question_disease_relation_id 
      FROM questions q 
      JOIN question_disease_relation qdr ON q.question_id = qdr.question_id
      WHERE q.question_id = $1 AND qdr.disease_id = $2`;

  con.query(check_question_query, [question_id, disease_id], (err, result) => {
      if (err) {
          console.error("Error checking question status and relationship:", err.stack);
          return res.status(500).json({ error: 'Internal server error while checking question status and relationship' });
      }

      // Check if the question is active and has a relationship with the specified disease
      if (result.rows.length === 0 || result.rows[0].status !== 'active') {
          return res.status(400).json({ 
              error: 'The question is either inactive or does not have a relationship with the specified disease.' 
          });
      }

      // Proceed with updating the option or weightage
      const queries = [];
      const queryValues = [];

      // Update the option text if provided
      if (option_text) {
          const update_option_query = `
              UPDATE options 
              SET options = $1
              WHERE options_id = $2 AND question_id = $3`;
          queries.push(update_option_query);
          queryValues.push([option_text, options_id, question_id]);
      }

      // Update the weightage if provided
      if (weightage !== undefined) {
          const update_weightage_query = `
              UPDATE questions_disease_weightage 
              SET weightage = $1 
              WHERE options_id = $2 AND question_id = $3 AND disease_id = $4`;
          queries.push(update_weightage_query);
          queryValues.push([weightage, options_id, question_id, disease_id]);
      }

      // Execute the update queries
      Promise.all(queries.map((query, index) => {
          return con.query(query, queryValues[index]);
      }))
      .then(() => {
          res.status(200).json({ message: 'Option or weightage updated successfully' });
      })
      .catch((error) => {
          console.error("Error updating option or weightage:", error.stack);
          res.status(500).json({ error: 'Internal server error while updating option or weightage' });
      });
  });
});




app.listen(3000,()=>{
    console.log("server is running")
})