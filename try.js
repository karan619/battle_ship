window.onload = init;


function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    guessInput.focus();
    view.displayMsg("<h1>Battle Ship : <em>Karan</em></h1>");
    model.generateShipLocations();
}


var model = {
    numShips: 3,
    boardSize: 7,
    shipSunk: 0,
    shipLength: 3,
	
    isSunk: function(ship){
        for(var i=0; i<this.shipLength; i++){
            if(ship.hits[i]!=="hit"){
                return false;
            }
        }
        return true;
    },

    ships: [
    {
        locations: ["", "", ""],
        hits: ["", "", ""]
    },

    {
        locations: ["", "", ""],
        hits: ["", "", ""]
    },

    {
        locations: ["", "", ""],
        hits: ["", "", ""]
    }
    ],
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMsg("<h2>You got a hit, Guesses: "+controller.guesses+"</h2>");
                if(this.isSunk(ship)){
                    view.displayMsg("<h2>1 Battle Ship Sunk, Guesses: "+controller.guesses+"</h2>");
                    alert("You sunk 1 of "+this.numShips+" Battleships");
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMsg("<h2>You had a miss, Guesses: "+controller.guesses+"</h2>");
        return false;
    },
    

    collision: function(locations){
        for(var i=0;i<this.numShips;i++){
            var ship = model.ships[i];
            for(var j=0;j<locations.length;j++){
                if( ship.locations.indexOf(locations[j]) >= 0 ){
                    return true;
                }
            }
        }
        return false;

    },

    generateShipLocations: function(){
        var locations;
        for(var i=0;i<this.numShips;i++){
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
 			
            this.ships[i].locations = locations;
        }
    },
	
    generateShip: function(){
        var direction = Math.floor(Math.random()*2);
        var row,col;
        if(direction===0){
            row = Math.floor(Math.random()*(this.boardSize-this.shipLength));
            col = Math.floor(Math.random()*this.boardSize);
        }else{
            row = Math.floor(Math.random()*this.boardSize);
            col = Math.floor(Math.random()*(this.boardSize-this.shipLength));
        }
        var newShipLocations = [];
        for(var i=0;i<this.shipLength;i++){
            if(direction === 0){
                newShipLocations.push((row + i) + "" + col);
            } else{
                newShipLocations.push(row + "" + (col + i));
            }
        }
        return newShipLocations;
    }

};//Model object ended



var view = {
    displayMsg: function(msg) {
        document.getElementById("msgBoard").innerHTML = msg;
    },
    displayHit: function(loc) {
        document.getElementById(loc).setAttribute("class", "hit");
    },
    displayMiss: function(loc) {
        document.getElementById(loc).setAttribute("class", "miss");
    }
};

//Controller started

var controller = {
    guesses: 0,

    processGuesses: function(guess){
        var location = parseGuess(guess);
        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipSunk === model.numShips){
                view.displayMsg("All Battle Ships sunk, with " +this.guesses+" guesses");
                alert("Game completed!!");
            }
        }
		
        function parseGuess(guess){
            var alphabet = ["A","B","C","D","E","F","G"];
            if( guess === null || guess.length !== 2 ){
                alert("Guess is not valid");
            }else{
                var firstChar = guess.charAt(0);
                var row = alphabet.indexOf(firstChar);
                var column = guess.charAt(1);

                if( isNaN(row) || isNaN(column) ){
                    alert("Not a number");
                }else if( row<0 || row>=model.boardSize || column<0 ||column>=model.boardSize ){
                    alert("You went out of the board");
                }else{
                    return row+column;//As column is a string, this will be concatinated
                }
            }
            return null;
        }
    },//End of function
	
};//End of controller



function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    if(guessInput.value === null){
        alert("Your value is null");
    }
    var parsedValue = controller.processGuesses(guessInput.value);
    guessInput.value="";

}

function handleKeyPress(e) {
    if(e.keyCode === 13){
        var fireButton = document.getElementById("fireButton");
        fireButton.click();
        return false;
    }
}

