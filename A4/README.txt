Vy Nguyen
Student ID: 101093925
Email: veenguyen@cmail.carleton.ca

Joshua Harris
Student ID: 101091864
Email: joshuaiharris@cmail.carleton.ca

Version:
Node: v10.15.0
MacOs: MacOs High Sierra version 10.13.6

Install:
npm install

Note: if express isn't found still, please run command npm install express.js --save

Launch:
- Navigate to the assignment directory /2406A4_Vy_Josh
- Using this command:
          node server.js

Testing:
- Visit either link to get to the app:

http://localhost:3000
http://localhost:3000/
http://localhost:3000/index.html
http://localhost:3000/recipes
http://localhost:3000/recipes.html



- Type any ingredient, if there are more than one, use comma to seperate them.
- The page should load different recipe picture and its name that related to our desired ingredient
- If you click any picture, you will redirect to fork2fork for a step by step recipe.

Issues:
- If you search through http://localhost:3000/recipes?ingredient=basil for ingredient = basil, the app still find the ingredient
But the app didn't load.

Disclaimer: The code is recycle from tutorial 7 (thick server). We made a minor change on server.js, and modified most of canvasWithTimer.js.
We acknowledge this is our own work.
