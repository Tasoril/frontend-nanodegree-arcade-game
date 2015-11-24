// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // The initial location of the enemy.
    this.x = -170;

    // The enemy should randomly spawn on one of the three stone rows.
    this.y = (Math.floor(Math.random()*3) + 1);

    // The speed the enemy moves. This number will be multiplied by the user's delta time to calculate movement.
    this.speed = (Math.floor(Math.random()*400) + 200);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply the delta time by the speed of this enemy (set when the enemy was created) and then add the result to the current "x" location.
    this.x = (this.x + (this.speed * dt));

    // Collision Detection.
    // We only care about the player location if the player is on the same "y" coordinate as us.
    if(this.y == player.y) {
        // The player is on the same "y" coordinate as us, so we need to check if we have collided with the player on the "x" coordinate.
        // Because the tile width is 101 and the player "x" coordinate is stored in 0-5 notation, multiply that value by 101.
        // Add and subtract 45 to the enemy location as that is approximately half of the enemy sprite width with a few pixels to spare and "x" is calculated on center.
        if(((this.x + 45) >= (player.x * 101)) && ((this.x - 45) <= (player.x *101))) {
            // We are in the collision range. Reset the player to start.
            //Reset the player's score to 0.
            player.score = 0;
            player.reset();
        }
    }

    // Check to see if the enemy has left the play area.
    // If it has, remove it from the allEnemies array and create a new enemy that starts at the left of the screen.
    if(this.x > 600) {
        // The enemy has left the play area. Remove this enemy from the allEnemies array.
        allEnemies.splice(allEnemies.indexOf(this),1);
        // Create a new enemy to replace the removed one.
        allEnemies.push(new Enemy());
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y * 83 - 25);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Define the player's sprite.
    this.sprite = 'images/char-boy.png';
    // Our start point ix "x" 2, "y" 4. Set those values.
    this.x = 2;
    this.y = 4;
    // We start out with a score of 0.
    this.score = 0;
    // Our high score is also 0 to start.
    this.highScore = 0;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    // Draw the player to the screen.
    // Multiply the "x" coordinate by the tile width of 101.
    // Multiply the "y" coordinate by the tile height of 83 and subtract half the player sprite height of 42 for proper centering.
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 42);
};

Player.prototype.update = function() {
    // By calling the render function within the update function instead of during the runtime of handleInput we ensure that
    // the player moves at the same time as the enemies and collision detection is run.
    // player.render applies any movements to the player or the player's score that have happened in the past dt.
    // Draw the score to the scoreboard.
    document.getElementById("scoreboard").innerHTML = "Score: "+player.score;
    // Check if the current score is greater than the current high score.
    if(player.highScore < player.score) {
        // New high score!
        // Set our current highScore to the player's highScore.
        player.highScore = player.score;
        // Draw the new highscore to the high score scoreboard.
        document.getElementById("high-scoreboard").innerHTML = "High Score: "+player.highScore;
    }
    // Draw the player's current location.
    player.render();
}

Player.prototype.reset = function() {
    // The player has either collided with an enemy or reached the safety of the water.
    // Reset them to our start location to go again!
    player.x = 2;
    player.y = 4;
}

// Move the player when one of the movement keys is released.
Player.prototype.handleInput = function(whichKey) {
    // Ensure the user is not still on character select.
    if(document.getElementById("modal").className != "invisible") {
        return;
    }
    // Use a switch to loop through all possible values for whichKey that we may receive.
    switch(whichKey) {
        case "up":
            // The player pressed "up" or "w"
            // Special case: We need to check to see if they moved up to the water tile.
            // We use <= as a catchall in case something causes them to not register the water the first time, though this should not happen.
            if(player.y <= 1) {
                // The player reached the water!
                // Add 1 point to the player's current score.
                player.score = player.score + 1;
                // Reset them to the start point.
                player.reset();
            } else {
                // The player moved up one tile, but hasn't reached the water yet.
                player.y = player.y - 1;
            }
            break;
        case "down":
            // The player pressed "down" or "s"
            // Special Case: Ensure that the player isn't on the bottom tile.
            if(player.y < 5) {
                // The player isn't on the bottom tile, so moving down is okay.
                player.y = player.y + 1;
            }
            break;
        case "left":
            // The player pressed "left" or "a"
            // Special Case: Ensure that the player isn't on the leftmost tile.
            if(player.x > 0) {
                // The player isn't on the leftmost tile, so moving left is okay.
                player.x = player.x - 1;
            }
            break;
        case "right":
            // The player pressed "right" or "d"
            // Special Case: Ensure that the player isn't on the rightmost tile.
            if(player.x < 4) {
                // The player isn't on the rightmost tile, so moving right is okay.
                player.x = player.x + 1;
            }
            break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Create the player object.
var player = new Player();

// Setup an allEnemies array to store our enemies.
var allEnemies = [];

// Create our initial enemies for the game area by pushing them to the allEnemies array.
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        87: 'up',
        65: 'left',
        83: 'down',
        68: 'right'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// Change the character sprite to the player's selected sprite from character select.
function selectCharacter(character) {
    player.sprite = "images/"+character+".png";
    // Hide the modal and modal background that are used for character select.
    document.getElementById("modal").className = "invisible";
    document.getElementById("modal-background").className = "invisible";
}