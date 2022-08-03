const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://FullstackDev:${password}@cluster0.62zyadx.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//if else statement for choosing to display or add with process.argv

if (process.argv.length > 3) {
    //ADDING NEW PERSON
    mongoose.connect(url)
    .then(result => {
        //console.log(result)
        console.log('connected and adding person')
        //console.log(process.argv.length) ----> 5 while adding person

        const newPerson = new Person({
            name: name,
            number: number
        })
        return newPerson.save()
    }).then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
    }).catch((err) => console.log(err))
} else {
    //SHOWING DATA
    mongoose.connect(url)
    .then(result => {
        console.log('connected and showing data')

        Person.find({}).then(result => {
            result.forEach(person => console.log(person))
        }).then( mongoose.connection.close() )
    })
}