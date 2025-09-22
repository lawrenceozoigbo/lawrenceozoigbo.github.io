require('dotenv').config();

console.log('DEBUG: SMTP Host from .env:', process.env.SMTP_HOST);
console.log('DEBUG: Email User from .env:', process.env.EMAIL_USER);
console.log('DEBUG: SMTP Port from .env:', process.env.SMTP_PORT);

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
// require('dotenv').config(); // Make sure this is at the top if you use .env

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- CORRECTED STATIC PATH ---
// Serve static files (HTML, CSS, JS, images) from the current directory 
// where server.js is located (e.g., C:\Users\Kamsi\Documents\projects\)
app.use(express.static(__dirname));
// This means if you have a file C:\Users\Kamsi\Documents\projects\js\main.js,
// it can be accessed via http://localhost:3000/js/main.js

// --- Routes ---

// Route to serve the home page
app.get('/', (req, res) => {
    // Assumes home.html is in the same directory as server.js
    res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/home', (req, res) => { // Alias if needed
    res.sendFile(path.join(__dirname, 'home.html'));
});

// --- CORRECTED ROUTE FOR CONTACT PAGE ---
// Route to serve the contact page
app.get('/contact', (req, res) => {
    // Assumes contact.html is in the same directory as server.js
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Route to handle form submission (this part should be fine)
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER_NO_REPLY || process.env.EMAIL_USER}>`,
        to: process.env.RECEIVING_EMAIL,
        replyTo: email,
        subject: `Contact Form: ${subject} (from ${name})`,
        text: `You have a new message from:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `<p>You have a new message from:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully from:', email);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: `Failed to send email. ${error.code ? `(Code: ${error.code})` : ''}` });
    }
});

// Optional: Catch-all for 404s if a file isn't found by static middleware or other routes
app.use((req, res) => {
    // You can create a 404.html page if you want a custom one
    // res.status(404).sendFile(path.join(__dirname, '404.html'));
    res.status(404).send("Sorry, page not found!");
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Home page: http://localhost:${port}/`); // or /home.html if you don't have the '/' route
    console.log(`Contact page: http://localhost:${port}/contact`); // or /contact.html
});