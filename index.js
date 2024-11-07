'use strict';

const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', age: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', age: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', age: '39-23-6423122' }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});