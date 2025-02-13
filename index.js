'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === parseInt(req.params.id));
    if (!person) return res.status(404).send('Person not found');
    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const personIndex = persons.findIndex(p => p.id === parseInt(req.params.id));
    if (personIndex === -1) return res.status(404).send('Person not found');

    const deletedPerson = persons.splice(personIndex, 1);
    res.json(deletedPerson);
});

app.post('/api/persons', (req, res) => {
    const person = req.body;
    if (!person.name || !person.number) return res.status(400).send('Name or number missing');

    if (persons.find(p => p.name === person.name)) return res.status(400).send('Name must be unique');

    const id = Math.floor(Math.random() * 100000);

    if (persons.find(p => p.id === id)) {
        id *= Math.floor(Math.random() * 100000);
    };

    const newPerson = { 
        id: id,
        ...person 
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
});

const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
