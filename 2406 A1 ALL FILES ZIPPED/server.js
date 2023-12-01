
//Server Code
const http = require("http"); //need to http
const fs = require("fs"); //need to read static files
const url = require("url"); //to parse url strings

const ROOT_DIR = "html"; //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}



const get_mime = function(filename) {
  //Use file extension to determine the correct response MIME type
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
       return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}

http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    var receivedData = ""

    //Event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    })

    //Event handler for the end of the message
    request.on("end", function() {
      console.log("received data: ", receivedData)
      console.log("type: ", typeof receivedData)

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {2
        //Handle POST requests
        var dataObj = JSON.parse(receivedData)
        console.log("received data object: ", dataObj)
        console.log("type: ", typeof dataObj)
        //Here we can decide how to process the data object and what
        //object to send back to client.
        //FOR NOW EITHER JUST PASS BACK AN OBJECT
        //WITH "text" PROPERTY

        //TO DO: return the words array that the client requested
        //if it exists
        console.log("USER REQUEST: " + dataObj.text)
        var returnObj = {}
        returnObj.text = "NOT FOUND: " + dataObj.text;

        console.log(__dirname + "//songs/"+ dataObj.text + ".txt")
        fs.readFile( __dirname + "//songs/"+ dataObj.text + ".txt", function(err, data){// reads song to check if its in files
        if (err) {
            console.log("ERROR SONG: "+ dataObj + " Not found" )  // if song not found return error
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
          }
          else{
            let lyrics = ""

            for(let charCode of data){
              lyrics += String.fromCharCode(charCode)
            }

            console.log("lyrics = " + lyrics)

            //returnObj.text = dataObj
            //onsole.log("Result: " + JSON.stringify(dataObj))
            response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] })
            returnObj = {wordArray: lyrics}

            response.end(JSON.stringify(returnObj))
            //returnObj.text = "FOUND"
            return

          }
        })

        //object to return to client
}
      if (request.method == "GET") {
        //Handle GET requests
        //Treat GET requests as request for static file
        var filePath = ROOT_DIR + urlObj.pathname
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/assignment1.html"

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          //respond with file contents
          response.writeHead(200, { "Content-Type": get_mime(filePath) })
          response.end(data)
        })
      }
    })
  }).listen(3000)


console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000/assignment1.html")
