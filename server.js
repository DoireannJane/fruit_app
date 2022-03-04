// we require the express module
const express = require('express')
const methodOverride = require("method-override");

// here, we're building our application and referring to it as app
// here is our app object before liquid
// const app = express()
// here we are using the liquid-express-views package from npm
const app = require('liquid-express-views')(express())

// save our port to a variable and call it in app.listen
const port = 3000

// Now that we're utilizing the principles or MVC, we need to import our fruits from models/fruits.js
const fruits = require('./models/fruits.js')

// MIDDLEWARE INTRO

console.log('these are my fruits', fruits)
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


// MORE MIDDLEWARE

// Middleware functions are functions that have access to the
//  request object (req), the response object (res), and the
//  next middleware function in the application’s 
// request-response cycle. The next middleware function is 
// commonly denoted by a variable named next.

// Middleware functions can perform the following tasks:
// Execute any code.
// Make changes to the request and the response objects.
// End the request-response cycle.
// Call the next middleware function in the stack.

app.use((req, res, next) => {
    console.log('I run for all routes');
    next();
});

//near the top, around other app.use() calls
app.use(express.urlencoded({extended:false}));


// METHOD OVERRIDE 
app.use(methodOverride("_method"));

// express.urlencoded() is a built-in parser method 
// express to recognize the incoming Request Object as strings or arrays. 

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



// here's our homepage controller
app.get('/', (req, res) => {
    res.send('<a href="/fruits">Show Me Some Froots</a>')
})


// these routes are our controllers
// INDEX route for fruits -> shows all fruits
// viewing our fruits that are in fruits.js
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

// NEW Fruit Route 
//put this above your show
app.get('/fruits/new', (req, res) => {
    res.render('new');
});


// POST route
app.post('/fruits', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    console.log(fruits);
    res.redirect('/fruits');
});

// DELETE ROUTE

app.delete("/fruits/:indexOfFruitsArray", (req, res) => {
    fruits.splice(req.params.indexOfFruitsArray, 1); //remove the item from the array
    res.redirect("/fruits"); //redirect back to index route
    
  });


//   EDIT ROUTE

app.get("/fruits/:indexOfFruitsArray/edit", (req, res) => {
    res.render(
      "edit.liquid", //render views/edit.liquid
      {
        //pass in an object that contains
        fruit: fruits[req.params.indexOfFruitsArray], //the fruit object
        index: req.params.indexOfFruitsArray, //... and its index in the array
      }
    );
  });


// UPDATE ROUTE
app.put("/fruits/:indexOfFruitsArray/", (req, res) => {
    //:indexOfFruitsArray is the index of our fruits array that we want to change
    if (req.body.readyToEat === "on") {
      //if checked, req.body.readyToEat is set to 'on'
      req.body.readyToEat = true;
    } else {
      //if not checked, req.body.readyToEat is undefined
      req.body.readyToEat = false;
    }
    fruits[req.params.indexOfFruitsArray] = req.body; //in our fruits array, find the index that is specified in the url (:indexOfFruitsArray).  Set that element to the value of req.body (the input data)
    res.redirect("/fruits"); //redirect to the index page
  });




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
});