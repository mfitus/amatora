// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3306;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'bqq5wyppbxc5gasserx0-mysql.services.clever-cloud.com',
    user: 'ug8fjhlm1seljjec',
    password: 'ug8fjhlm1seljjec',
    database: 'bqq5wyppbxc5gasserx0'
});
// USSD route
app.post('/ussd', (req, res) => {
    let { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        response = `CON Welcome to the Voting Service
        1. MFITUMUKIZA Eric
        2. KABATESI Shamimu`;
    } else if (text === '1') {
        response = `END You voted for Candidate A`;
        saveVote(phoneNumber, 'Candidate A');
    } else if (text === '2') {
        response = `END You voted for Candidate B`;
        saveVote(phoneNumber, 'Candidate B');
    } else {
        response = `END Invalid option`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

const saveVote = (voterId, candidate) => {
    let query = 'INSERT INTO votes (voter_id, candidate) VALUES (?, ?)';
    db.query(query, [voterId, candidate], (err, result) => {
        if (err) throw err;
        console.log('Vote saved');
    });
};
// Home route
app.get('/', (req, res) => {
    res.send('USSD Voting Application');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
