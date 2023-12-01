/*
COMP 2406 (c) L.D. Nel 2018

Javascript to handle mouse dragging and release
to drag a string around the html canvas.
Keyboard arrow keys are used to move a moving box around.

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM elements are the canvas on which
where are drawing and a text field and button where the user can type data.

This example shows examples of using JQuery.
JQuery is a popular helper library that has useful methods,
especially for sendings asynchronous (AJAX) requests to the server
and catching the responses.



Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data
*/

//Use javascript array of objects to represent words and their locations



//Array of movable  lyrics / chords


let timer //use for animation motion

let wordBeingMoved
let words = [] //Array of movable  lyrics / chords

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1') // drawing canvas
let context = canvas.getContext('2d')

const notesArray = [['[A]','[A#]','[B]','[C]','[C#]','[D]','[D#]','[E]','[F]','[F#]','[G]','[G#]'],['[A]','[Bb]','[B]','[C]','[Db]','[D]','[Eb]','[E]','[F]','[Gb]','[G]','[Ab]']]


let movingString = {
  word: "Moving",
  x: 100,
  y: 100,
  xDirection: 1, //+1 for leftwards, -1 for rightwards
  yDirection: 1, //+1 for downwards, -1 for upwards
  stringWidth: 50, //will be updated when drawn
  stringHeight: 24
}

function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using lenght of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  let context = canvas.getContext('2d')
  for (let i = 0; i < words.length; i++) {
    if (Math.abs(words[i].x - aCanvasX) < 100 &&
      Math.abs(words[i].y - aCanvasY) < 20) return words[i]
  }
  return null
}

function drawCanvas() {

  let context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '15pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {


    let wordData = words[i]
    if (wordData.word.charAt(0)==="["){
      context.fillStyle= "green"
    }
    context.fillText(wordData.word, wordData.x, wordData.y)
    context.strokeText(wordData.word, wordData.x, wordData.y)
  //  wordData.stringWidth = context.measureText(wordData.word).width

  }
  context.stroke()
}


function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  console.log("mouse move")

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  console.log("mouse up")

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer() {
  //movingString.x = (movingString.x + 5 * movingString.xDirection)
  // movingString.y = (movingString.y + 5 * movingString.yDirection)
  //
  // //keep inbounds of canvas
  // if (movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1
  // if (movingString.x < 0) movingString.xDirection = 1
  // if (movingString.y > canvas.height) movingString.yDirection = -1
  // if (movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1

  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  console.log("keydown code = " + e.which)
  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}



function handleKeyUp(e) {
  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)


    $.post("positionData", jsonString, function(data, status) {
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let wayPoint = JSON.parse(data)
      wayPoints.push(wayPoint)
      for (let i in wayPoints) console.log(wayPoints[i])
    })
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()
}

function handleSubmitButton() {

  let userText = $('#userTextField').val(); //get text from user text input field
  let text

  if (userText && userText != '') {
    //user text was not empty
    let userRequestObj = {
      text: userText
    } //make object to send to server

    let userRequestJSON = JSON.stringify(userRequestObj)
    $('#userTextField').val('') //clear the user text field

    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("userText", userRequestJSON, function(data, status) {
      let context = canvas.getContext('2d')
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let responseObj = JSON.parse(data)
      movingString.word = responseObj.text
      //replace word array with new words if there are any
      if (responseObj.wordArray) allWords = responseObj.wordArray
      splitWordsUp(allWords)
      drawCanvas()
    })
    words = []      //clears canvas
    }

}
// handles seprating
function splitWordsUp(allWords){

  let x = 20
  let y = 30
  console.log(allWords)

  let userText = $('#userTextField').val(); //get text from user text input field

  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '<p> </p>'

  allWords = allWords.replace(/\[/g, " [")
  allWords = allWords.replace(/\]/g, "] ")
  let lines = allWords.split("\n")

  for (i=0; i<lines.length; i++){
      textDiv.innerHTML = textDiv.innerHTML +`<p> ${lines[i]}</p>`
  }
  for(i=0; i<lines.length; i++){
    lines[i] = lines[i].split(" ")
  }

//printing to canvas
  for(i=0; i<lines.length; i++){
    x = 20
    for(j=0; j<lines[i].length; j++){
      word = lines[i][j]
      words.push({word: word, x:x, y:y})
      x += context.measureText(word).width + 15
    }
    y += 50
  }

}

function transposeDown(){
  for(i = 0; i<words.length; i++){              //iterate over every word in canvas
    let chords = words[i]
    if (chords.word.charAt(0) === "["){
      for(j = 0; j<notesArray.length; j++){     //looks through both sepreate note array
        for(k=0; k<notesArray[j].length; k++){
          if (chords.word == notesArray[j][k]){ //if chord is the same as note in notesArray
            if (k == 0){                        //if index of array is  at the min value(0), reset to 11
              chords.word = notesArray[j][11]
            }else{
              chords.word = notesArray[j][k-1]
            }
            break
          }
        }
      }
    }
  }
drawCanvas()
}

function transposeUp(){
  for(i = 0; i<words.length; i++){              //iterate over every word in canvas
    let chords = words[i]
    if (chords.word.charAt(0) === "["){
      for(j = 0; j<notesArray.length; j++){
        for(k=0; k<notesArray[j].length; k++){  //Looks through every note in NoteArray
          if (chords.word == notesArray[j][k]){
            if (k == notesArray[j].length-1){   //if index of array is  at the max value(12), reset back to 0
              chords.word = notesArray[j][0]
            }else{
              chords.word = notesArray[j][k+1]
            }
            break
          }
        }
      }
    }
  }
drawCanvas()
}





$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)
  $("#submitButton").click(handleSubmitButton)

  timer = setInterval(handleTimer, 100)

  drawCanvas()
})
