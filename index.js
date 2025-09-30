const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.static('dist'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }

]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) { response.json(person) }
  else { response.status(404).end() }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  person = persons.find(p => p.id === id)
  persons = persons.filter(person => person.id !== id)

  response.json(person).status(204)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (persons.some(e => e.name == body.name)) {
    return response.status(400).send({
      error: 'name must be unique'
    })
  }

  if (!body.name || !body.number) {
    return response.status(400).send({
      error: 'name or number missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 99999999).toString()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
    const ts = Date.now();

    const date_time = new Date(ts);

    response.send('<p>Phonebook has info for ' + persons.length + ' people</p>' +
        '<p>' + date_time + '</p>'
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})