const BASE_URL = "https://f16857yem0.execute-api.eu-north-1.amazonaws.com/Beta"
const HOST_URL = window.location.href.substring(0, window.location.href.lastIndexOf('/'));

window.onload = (function () {

    // This lists the workouts for the frontpage
    if (document.getElementById("workouts")) {
        const url = BASE_URL + "/workouts";
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                let workouts = JSON.parse(data["body"]);
                createWorkoutList(workouts);
            });
    }

    // Fetch info of a single workout for the page
    else if (document.getElementById("workout-info")) {
        let workoutId = getCurrentWorkoutId();
        const url = BASE_URL + "/workouts/" + workoutId;
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                let workout = data;
                fillWorkoutPage(workout);
            });
    }

    // List all the moves on the moves page
    else if (document.getElementById("move-inputs")) {
        const url = BASE_URL + "/moves";
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                let moves = JSON.parse(data["body"]);
                createMoveList(moves);
            });
    }
})


function getCurrentWorkoutId() {
    let queryString = window.location.search;
    let params = new URLSearchParams(queryString);
    let workoutId = params.get('workoutId');
    return workoutId
}

/**
 * Returns a promise that solves into list of moves
 */
function getMoves() {
    const url = BASE_URL + "/moves";
    return fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            return JSON.parse(data["body"]); 
        })
        .catch(function (error) {
            console.log(error);
        });
}


function fillWorkoutPage(workout) {
    document.getElementById("workout-name").textContent = workout["name"];
    document.getElementById("workout-date").textContent = workout["date"];
    let select = document.getElementById("move");
    getMoves().then((moves) => {
        moves.forEach(move => {
            let option = document.createElement("option");
            option.value = move["moveId"];
            option.textContent = move["name"];
            select.appendChild(option);
        });
    });

    workout["exercises"].forEach( exercise => {
        let exerciseContainer = document.getElementById("exercises");
        exerciseContainer.appendChild(createExercise(exercise));


    })
}


function createWorkoutList(workouts) {
    let container = document.getElementById("workouts");
    workouts.forEach(workout => {
        let item = document.createElement("div");
        item.classList.add("item");

        let itemLink = document.createElement("a");
        let url = HOST_URL + "/workout.html?workoutId=" + workout["workoutId"];
        itemLink.setAttribute("href", url);
        let itemName = document.createElement("h3");
        let itemText = document.createTextNode(workout['name']);
        itemName.appendChild(itemText);
        itemLink.appendChild(itemName)
        item.appendChild(itemLink);

        let itemDate = document.createElement("h4");
        let itemDateText = document.createTextNode(workout['date']);
        itemDate.appendChild(itemDateText);
        item.appendChild(itemDate);

        container.appendChild(item);
    });
}


function createMoveList(moves) {
    let container = document.getElementById("moves");
    moves.forEach(move => {
        let item = document.createElement("div");
        item.classList.add("item");

        let itemLink = document.createElement("a");
        let url = HOST_URL + "/move.html?moveId=" + move["moveId"];
        itemLink.setAttribute("href", url);
        let itemName = document.createElement("h3");
        let itemText = document.createTextNode(move['name']);
        itemName.appendChild(itemText);
        itemLink.appendChild(itemName)
        item.appendChild(itemLink);

        let itemDesc = document.createElement("h4");
        let itemDescText = document.createTextNode(move['description']);
        itemDesc.appendChild(itemDescText);
        item.appendChild(itemDesc);

        container.appendChild(item);
    });
}












function createExercise(ex) {
   let container = document.createElement("div");
   container.classList.add("exercise-item");
   let name = document.createElement("h4");
   let text = document.createTextNode(ex['moveName']);
   name.appendChild(text);
   container.appendChild(name);

   let contents = document.createElement("p");
   let contentsText = document.createTextNode(`${ex["weights"]}kg x ${ex["reps"]} x ${ex["sets"]}`);
   contents.appendChild(contentsText);
   container.appendChild(contents);

   return container;
}




function addExercise() {
    let select = document.getElementById("move")
    let moveName = select.options[select.selectedIndex].textContent;
    let moveId = select.value;
    let weights = document.getElementById("weights").value;
    let reps = document.getElementById("reps").value;
    let sets = document.getElementById("sets").value;

    let data = {
        moveName: moveName,
        moveId: moveId,
        weights: weights,
        reps: reps,
        sets: sets
    }

    let workoutId = getCurrentWorkoutId();
    const url = BASE_URL + "/workouts/" + workoutId;

    let request = new Request(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        mode: 'cors'
    });

    fetch(request)
    .then( () => window.location.reload() )
        
}


function createWorkout() {
    let name = document.getElementById("workout-name").value;
    let date = document.getElementById("workout-date").value;
    let data = {
        name: name,
        date: date
    }
    const url = BASE_URL + "/workouts";

    let request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors'
    });

    fetch(request)
        .then((resp) => resp.json())
        .then(function (respData) {
            console.log(respData)
            let workout = JSON.parse(respData["body"]);
            let workoutId = workout["workoutId"];
            let hostUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
            let workoutPageUrl = hostUrl + "/workout.html?workoutId=" + workoutId;

            window.location.replace(workoutPageUrl);
            //TODO: maybe add error handling?
        })
        .catch(function (error) {
            console.log(error);
        });

}


function createMove() {
    let name = document.getElementById("move-name").value;
    let description = document.getElementById("move-description").value;
    let data = {
        name: name,
        description: description
    }
    const url = BASE_URL + "/moves";

    let request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors'
    });

    fetch(request)
        .then((resp) => resp.json())
        .then(function (respData) {
            let move = JSON.parse(respData["body"]);
            let moveId = move["moveId"];
            let hostUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
            let movePageUrl = hostUrl + "/move.html?moveId=" + moveId;

            window.location.replace(movePageUrl);
            //TODO: maybe add error handling?
        })
        .catch(function (error) {
            console.log(error);
        });

}

function checkInputs() {
    let inputs = document.getElementsByTagName("input");
    let inputsFilled = 0;
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].value != '') {
            inputsFilled++;
        }
    };
    let btn =  document.getElementsByClassName("submit-button")[0];
    if (inputs.length == inputsFilled) {
       btn.removeAttribute("disabled");
    } else if (!btn.hasAttribute("disabled")){
        btn.setAttribute("disabled", "true");
    }
}