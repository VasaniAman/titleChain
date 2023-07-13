import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const salt = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'csproject',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database.');
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "Uhh ohh... Looks like you are not logged in" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not valid" });
      } else {
        req.name = decoded.name;
        req.email = decoded.email; // Add email property to the request object
        next();
      }
    });
  }
};

app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name, email: req.email }); // Include email property in the response
});

app.post('/register', (req, res) => {
  const sql =
    'INSERT INTO users (`name`, `email`, `password`, `role`) VALUES (?, ?, ?, "user")';
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: 'Error hashing the password' });
    const values = [req.body.name, req.body.email, hash];
    db.query(sql, values, (err, result) => {
      if (err) return res.json({ Error: 'Insert error in server' });
      return res.json({ Status: 'Success' });
    });
  });
});

app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: 'Login error in server' });
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) return res.json({ Error: 'Password compare error' });
        if (response) {
          const user = {
            name: data[0].name,
            role: data[0].role.trim(),
            email: data[0].email // Add email property to the user object
          };
          const token = jwt.sign(user, 'jwt-secret-key', { expiresIn: '1d' });
          res.cookie('token', token);
          return res.json({ Status: 'Success', user });
        } else {
          return res.json({ Error: 'Password is incorrect.' });
        }
      });
    } else {
      return res.json({ Error: 'The email does not exist. Kindly register.' });
    }
  });
});

app.get('/getUsers', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.json({ Status: 'Error', Error: 'Failed to fetch user details' });
    }
    return res.json({ Status: 'Success', users: data });
  });
});

app.put('/updateUser/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
  db.query(sql, [name, email, role, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.json({ Status: 'Error', Error: 'Failed to update user' });
    }
    return res.json({ Status: 'Success', message: 'User updated successfully' });
  });
});

app.delete('/deleteUser/:email', (req, res) => {
  const email = req.params.email;

  const sql = 'DELETE FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.json({ status: 'Error', error: 'Failed to delete the user' });
    }

    return res.json({ status: 'Success' });
  });
});

app.put('/updateVerifiedUpload/:id', (req, res) => {
  const { id } = req.params;
  const { user_email } = req.body;

  const sql = 'UPDATE verifieduploads SET user_email = ? WHERE id = ?';
  db.query(sql, [user_email, id], (err, result) => {
    if (err) {
      console.error('Error updating title deed holder email:', err);
      return res.json({ Status: 'Error', Error: 'Failed to update title deed holder email' });
    }
    return res.json({ Status: 'Success', message: 'Title deed holder email updated successfully' });
  });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: "Success" });
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      res.status(404).json({ message: 'Email not found' });
    } else {
      const newPassword = generateRandomPassword();
      const expirationTime = new Date().getTime() + 5 * 60 * 1000; // Set expiration time to 5 minutes from now

      // Update the password and expiration time in the database
      const updatePasswordQuery = 'UPDATE users SET password = ?, reset_expires = ? WHERE email = ?';
      db.query(updatePasswordQuery, [newPassword, expirationTime, email], (err) => {
        if (err) throw err;
        console.log('Password reset successfully');

        // Send the new password to the user's email address
        sendEmail(email, 'Password Reset', `Dear ${email}, 
Please copy and paste the following one-time password: 
${newPassword}

Click here to access the reset password page: http://localhost:3000/reset-password

**This password will expire in 5 minutes`);

        res.status(200).json({ message: 'Password reset successful' });
      });
    }
  });
});

app.post('/reset-password', (req, res) => {
  const { tempPassword, newPassword } = req.body;

  // Check if the password exists in the database and is not expired
  const checkTempPasswordQuery = 'SELECT password, reset_expires FROM users WHERE password = ?';
  db.query(checkTempPasswordQuery, [tempPassword], (error, results) => {
    if (error) {
      console.error('Error checking temp password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0 || tempPassword !== results[0].password) {
      return res.status(404).json({ message: 'A match has not occurred' });
    }

    const resetExpires = results[0].reset_expires;
    const currentTime = new Date().getTime();

    if (currentTime > resetExpires) {
      return res.status(401).json({ message: 'Password reset link has expired' });
    }

    // Hash the new password
    bcrypt.hash(newPassword.toString(), salt, (err, hash) => {
      if (err) {
        console.error('Error hashing new password:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // Update the password in the database
      const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
      const checkTempEmailQuery = 'SELECT email FROM users WHERE password = ?';
      db.query(checkTempEmailQuery, [tempPassword], (err, emailResults) => {
        if (err) {
          console.error('Error retrieving email:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        if (emailResults.length === 0) {
          return res.status(404).json({ message: 'Email not found' });
        }

        const email = emailResults[0].email;
        db.query(updatePasswordQuery, [hash, email], (err) => {
          if (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          console.log('Password updated successfully');
          return res.status(200).json({ message: 'Password reset successful' });
        });
      });
    });
  });
});

// Helper function to generate a random password
function generateRandomPassword() {
  const length = 25;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}

// Helper function to send an email
async function sendEmail(email, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.log('Error sending email:', error);
  }

  console.log(`Email sent to: ${email}\nSubject: ${subject}\nMessage: ${message}`);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/xampp/htdocs/csproject-develop/csproject-develop/frontEnd/src/uploads'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Generate a unique filename
    cb(null, uniqueSuffix + '-' + file.originalname); // Set the filename for the uploaded file
  },
});

// Create the multer instance with the configured storage
const upload = multer({ storage });

app.post('/saveFilePath', (req, res) => {
  const filePath = req.body.filePath;
  const issuerName = req.name;
  const issuerEmail = req.email;

  const sql = 'INSERT INTO unverifiedUploads (issuer_name, issuer_email, file_path) VALUES (?, ?, ?)';
  db.query(sql, [issuerName, issuerEmail, filePath], (err, result) => {
    if (err) {
      console.error('Error saving file path to the database:', err);
      return res.status(500).json({ error: 'Failed to upload the file' });
    }

    return res.json({ message: 'File path saved successfully' });
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const issuerName = req.body.issuerName; // Retrieve the issuer name from the request body
  const issuerEmail = req.body.issuerEmail; // Retrieve the issuer email from the request body

  console.log('File path:', filePath); // Log the file path value
  console.log('Issuer name:', issuerName); // Log the issuer name value
  console.log('Issuer email:', issuerEmail); // Log the issuer email value

  const sql = 'INSERT INTO unverifiedUploads (issuer_name, issuer_email, file_path) VALUES (?, ?, ?)';
  const values = [issuerName, issuerEmail, filePath];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving file path:', err);
      return res.status(500).json({ error: 'Failed to save file path to the database', details: err.message });
    }
    return res.json({ message: 'File uploaded successfully', filePath });
  });
});

app.get('/getFileData', (req, res) => {
  const sql = 'SELECT id, issuer_name, issuer_email, file_path FROM unverifiedUploads';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving file data:', err);
      return res.status(500).json({ Status: 'Error', error: 'Failed to retrieve file data' });
    }
    if (results.length === 0) {
      return res.status(404).json({ Status: 'Error', error: 'File data not found' });
    }
    const fileData = results.map((result) => ({
      id: result.id,
      issuer_name: result.issuer_name,
      issuer_email: result.issuer_email,
      filePath: result.file_path,
    }));
    return res.json({ Status: 'Success', fileData });
  });
});

app.get('/previewFile', (req, res) => {
  const fileName = req.query.fileName;
  const filePath = path.join(__dirname, 'frontEnd/src/uploads', fileName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read file' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
  });
});

app.get('/getUnverifiedUploads', (req, res) => {
  const sql = 'SELECT id, issuer_name, issuer_email, file_path FROM unverifiedUploads';
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching unverified upload details:', err);
      return res.json({ Status: 'Error', Error: 'Failed to fetch unverified upload details' });
    }
    return res.json({ Status: 'Success', uploads: data });
  });
});

app.delete('/deleteUnverifiedUpload/:id', (req, res) => {
  const uploadId = req.params.id;

  const sql = 'DELETE FROM unverifiedUploads WHERE id = ?';
  db.query(sql, [uploadId], (err, result) => {
    if (err) {
      console.error('Error deleting unverified upload:', err);
      return res.json({ Status: 'Error', Error: 'Failed to delete unverified upload' });
    }

    return res.json({ Status: 'Success', message: 'Unverified upload deleted successfully' });
  });
});

app.post('/verifyUpload', verifyUser, (req, res) => {
  const { issuerEmail, verifierEmail, userEmail, filePath } = req.body;

  const insertQuery = 'INSERT INTO verifieduploads (issuer_email, verifier_email, user_email, file_path) VALUES (?, ?, ?, ?)';
  const insertValues = [issuerEmail, verifierEmail, userEmail, filePath];
  
  const deleteQuery = 'DELETE FROM unverifieduploads WHERE issuer_email = ? AND file_path = ?';
  const deleteValues = [issuerEmail, filePath];

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting database transaction:', err);
      return res.status(500).json({ error: 'Failed to start database transaction', details: err.message });
    }

    db.query(insertQuery, insertValues, (err, result) => {
      if (err) {
        console.error('Error storing verified upload:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to store verified upload', details: err.message });
        });
      }

      db.query(deleteQuery, deleteValues, (err, result) => {
        if (err) {
          console.error('Error deleting unverified upload:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to delete unverified upload', details: err.message });
          });
        }

        db.commit((err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            return db.rollback(() => {
              res.status(500).json({ error: 'Failed to commit transaction', details: err.message });
            });
          }

          return res.json({ message: 'Upload verified and stored successfully' });
        });
      });
    });
  });
});

app.get('/getVerifiedUploads', (req, res) => {
  const sql = 'SELECT id, issuer_email, verifier_email, user_email, file_path FROM verifieduploads';
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching verified upload details:', err);
      return res.json({ Status: 'Error', Error: 'Failed to fetch verified upload details' });
    }
    return res.json({ Status: 'Success', uploads: data });
  });
});


app.get('/getVerifiedUploadsUser', (req, res) => {
  const { user_email } = req.query;

  const sql = 'SELECT file_path, signature, signature_address FROM verifieduploads WHERE user_email = ?';
  db.query(sql, [user_email], (err, result) => {
    if (err) {
      console.error('Error fetching verified uploads:', err);
      return res.json({ Status: 'Error', Error: 'Failed to fetch verified uploads' });
    }
    return res.json({ Status: 'Success', uploads: result });
  });
});


app.listen(8081, () => {
  console.log('Server running on port 8081...');
});