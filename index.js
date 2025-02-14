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
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Make sure both name and number are provided'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    });
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    Person.findOne({ name: body.name })
    .then(existingPerson => {
        if (existingPerson) {
            const person = {
                name: body.name,
                number: body.number,
            };

            Person.findByIdAndUpdate(req.params.id, person, { new: true })
            .then(updatedPerson => {
                res.json(updatedPerson);
            })
            .catch(error => next(error));
        } else {
            res.status(400).json({ error: 'Name not found in phonebook' });
        }
    })
    .catch(error => next(error));
});

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
}

app.use(requestLogger);

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler);

const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
