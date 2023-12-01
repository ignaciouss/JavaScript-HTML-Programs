/*
(c) 2019 Louis. D. Nel
Vy Nguyen
Josh Harris

WARNING:
NOTE: THIS CODE WILL NOT RUN UNTIL YOU ENTER YOUR OWN fork2forkcom for APP ID KEY

NOTE: You need to intall the npm modules by executing >npm install
before running this server

Simple express server re-serving data from
To test:
http://localhost:3000
*/
const express = require('express') //express framework
const http_request = require('request') //helpful npm module for easy http requests
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT

/*YOU NEED AN APP ID KEY TO RUN THIS CODE
  GET ONE BY SIGNING UP AT openweathermap.org
*/
let API_KEY = '24519ea8a14d6e835c5ca21851203a90' //<== YOUR API KEY HERE


const app = express()

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

route = ["/index.html","/recipes","/recipes.html"]

app.get(route,(request,response) => {
  let ingredient = request.query.ingredient
  console.log('ingreident out loop ' + ingredient)
  let url = ''
  if(ingredient) {
    console.log('ingreident within loop ' + ingredient)
    url = `https://food2fork.com/api/search?key=${API_KEY}&q=${ingredient}`
    http_request.get(url, (err, res, data) => {
      return response.contentType('application/json').json(JSON.parse(data))
    })
  }else {
    response.sendFile(__dirname + '/views/index.html')
  }
})


// app.get("/index.html", function(req, res) {handleGet(req, res) })
// app.get("/recipes", function(req, res) {handleGet(req, res) })
// app.get("/recipes.html", function(req, res) {handleGet(req, res) })

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/recipes?ingredient=basil`)
    console.log('http://localhost:3000')
    console.log('http://localhost:3000/')
    console.log('http://localhost:3000/index.html')
    console.log('http://localhost:3000/recipes')
    console.log('http://localhost:3000/recipes.html')
  }
})
