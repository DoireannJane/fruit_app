// we require the express module
const express = require('express')

// here, we're building our application and referring to it as app
// here is our app object before liquid
// const app = express()
// here we are using the liquid-express-views package from npm
const app = require('liquid-express-views')(express())

// save our port to a variable and call it in app.listen
const port = 3000

// here we'll design a custom request logger
// this is a custom piece of what is known as middleware
// req is the request object, should be passed to reqLog when called
const reqLog = (req) => {
    console.log('===========================')
    console.log('this is the request object sent from the browser')
    console.log(`${req.method} request sent to ${req.url}`)
    console.log('req params are: ', req.params)
    console.log('===========================')
}

// all of my routes live below my request logger function
// all route callbacks are going to take in req and res
// req = request object
// res = response object

// fruits array holds fruit data
// this is the old fruits array
// const fruits = ['apple', 'banana', 'pear']

// Here is the new, more complex fruits array
// These fruits are our models
// const fruits = [
// 	{
// 		name: 'apple',
// 		color: 'red',
// 		readyToEat: true,
// 	},
// 	{
// 		name: 'pear',
// 		color: 'green',
// 		readyToEat: false,
// 	},
// 	{
// 		name: 'banana',
// 		color: 'yellow',
// 		readyToEat: true,
// 	},
// ]

// Now that we're utilizing the principles or MVC, we need to import our fruits from models/fruits.js
const fruits = require('./models/fruits.js')
// viewing our fruits that were exported fruits.js
console.log('these are my fruits', fruits)

// here's our homepage controller
app.get('/', (req, res) => {
    res.send('<a href="/fruits">Show Me Some Froots</a>')
})

// these routes are our controllers
// INDEX route for fruits -> shows all fruits
app.get('/fruits', (req, res) => {
    // calling reqLog, and passing the req object as an argument
    reqLog(req)
    // anywhere we see res.send, is our 'view'
    // res.send is what we used in our initial setup
    // this is useful for verifying the shape of our data
	// res.send(fruits)
    // now that we're using actual views, we call res.render
    // remember the second argument is the data we want to render
    // we render this data in index.liquid
    res.render('index', { fruits: fruits })
})

// SHOW route for specific fruits
// req param 'indexOfFruits' points to a specific item in frtuis array
app.get('/fruits/:indexOfFruits', (req, res) => {
    reqLog(req)
    // before, we were sending our data to the browser
    // res.send(fruits[req.params.indexOfFruits])
    // Now we want to render our views like this
    // res.render, will look in views for a file called show
    // the second argument is an object, so we can give our data a key and a value
    res.render('show', {fruit: fruits[req.params.indexOfFruits]})
})

app.listen(port, () => {
    console.log('server running and ready for fruits. port is ', port)
})