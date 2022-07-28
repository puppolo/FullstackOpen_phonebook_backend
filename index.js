const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ].join(' ')
  }))

//app.use(express.json())

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var today = new Date()

    res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${day[today.getDay()]} ${month[today.getMonth()]} ${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} GMT+7</div>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.send(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateID = () => {
    const maxId = persons.length + 1
    return maxId
}


app.post('/api/persons', (req, res) => {
     const body = req.body

     //name missing
     if(!body.name) {
        return res.status(400).json({error: 'name missing'})
     }
     //number missing
     if(!body.number) {
        return res.status(400).json({error: 'number missing'})
     }
     //duplicate name
     if(persons.some(person => person.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})
     }

     const person = {
        id : generateID(),
        name : body.name,
        number : body.number
     }

     persons = persons.concat(person)

     res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})