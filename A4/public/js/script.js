function getRecipes() {

    let ingredient = document.getElementById('ingredient').value
    if(ingredient === '') {
        return alert('Please enter an ingredient')
    }

    let recipeDiv = document.getElementById('recipes')
    recipeDiv.innerHTML = ''

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
      let count = response.count
       for (let i = 0; i < response.count; i++){
           let recipes = response.recipes[i]
 			recipeDiv.innerHTML += '<div style = "display: inline-block; border: 2px solid black;'
             + 'margin: 25px;">' + '<a target = "_blank" href = "' + recipes.f2f_url + '">'
             + '<img src=' + recipes.image_url
             + ' height = "375" width = "375"> <h2 style = "text-align: center;"'
             + '>' + recipes.title + '</h2></a></div>'
       }
       recipeDiv.innerHTML += '</p></body></html>'

      console.log(response)
        }
    }
    xhr.open('GET', `/recipes?ingredient=${ingredient}`, true)
    xhr.send()
}


//Attach Enter-key Handler
const ENTER=13
document.getElementById("ingredient")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ENTER) {
        document.getElementById("submit").click();
    }
});
