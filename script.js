const BASE_URL = "https://f16857yem0.execute-api.eu-north-1.amazonaws.com/Beta"

window.onload = (function() {
    if (document.getElementById("workouts")) {
        const url = BASE_URL + "/workouts";
        fetch(url)
        .then( (resp) => resp.json())
        .then(function(data) {
            let workouts = JSON.parse(data["body"])
            createWorkoutList(workouts);
        })
    }
    


})


function createWorkoutList(workouts) {
    let container = document.getElementById("workouts");
    workouts.forEach(workout => {
        let item = document.createElement("div");
        item.classList.add("item");
        
        let itemLink = document.createElement("a");
        itemLink.setAttribute("href", "#");
        let itemName = document.createElement("h3");
        let itemText = document.createTextNode(workout['name']);
        itemName.appendChild(itemText);
        itemLink.appendChild(itemName)
        item.appendChild(itemLink);

        let itemDate = document.createElement("h4");
        let itemDateText = document.createTextNode(workout['time']);
        itemDate.appendChild(itemDateText);
        item.appendChild(itemDate);

        container.appendChild(item);
    });
}



function createWorkout() {
    let name = document.getElementById("workout-name");
    let date = document.getElementById("workout-date");
    let data = {
        name: name,
        date: date
    }
    const url = BASE_URL + "/workouts";
    
    let request = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: new Headers()
    }); 

    fetch(request)
    .then(function() {
        alert(window.location.href);
        //let workoutPage = window.location.href
        //window.location.replace(window.location.href)
        //TODO: maybe add error handling?
    })
    .catch(function(error) {
        console.log(error);
    });

}