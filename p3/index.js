const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('object', function ( req, res) {
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace",  
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// const generateId = () => {
//     const maxId = notes.length > 0
//       ? Math.max(...notes.map(n => n.id))
//       : 0
//     return maxId + 1
//   }



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    // It's worth noting that JSON is a string, and not a JavaScript object like the value assigned to notes.
    response.json(persons)
})

app.get('/info', (req, res) => {
  const currentDate = new Date()
  res.send(`<h2>PhoneBook has info for ${persons.length} people</h2> <h2>${currentDate}</h2>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    // The if-condition leverages the fact that all JavaScript objects are truthy, meaning that they evaluate to true in a comparison operation. However, undefined is falsy meaning that it will evaluate to false.
    if (person) {
        response.json(person)
    } else {
        // If no note is found, the server should respond with the status code 404 not found instead of 200.
        // Since no data is attached to the response, we use the status method for setting the status, and the end method for responding to the request without sending any data.
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
   const body = request.body

  if (!body.name) {
    // Notice that calling return is crucial, because otherwise the code will execute to the very end and the malformed note gets saved to the application.
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }else if (!body.number){
    return response.status(400).json({ 
      error: 'number missing' 
    })
  } else if (persons.find(person => person.name === body.name ) !== undefined){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    number: body.number,
    name: body.name,
    id: Math.random(100000),
  }

  persons = persons.concat(person)
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})