/**********  Global Variable declarations **********/
const icons = [
    'fa-bicycle',
    'fa-anchor',
    'fa-apple',
    'fa-angellist',
    'fa-user-secret',
    'fa-rocket', 
    'fa-qq', 
    'fa-bomb',
    'fa-bolt',
    'fa-bell',
    'fa-thumbs-up',
    'fa-paw',
    'fa-paperclip',
    'fa-flag',
    'fa-eye',
    'fa-envelope',
    'fa-coffee'
];

let firstCard = null;
let secondCard = null;
let firstPick = 0;
let secondPick = 0;
let firstCardIcon = "";
let secondCardIcon = "";
let numPairs = 0;
let numMatches = 0;
let firstClick = true;
let minutesLbl = document.getElementById("minutes");
let secondsLbl = document.getElementById("seconds");
let totalSeconds = 0;
let timer = null;

/**********  Function declarations **********/

/*****  Build a new deck and display in DOM *****/
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function buildDeck () {
    /* stop listening while building the deck */
    document.querySelector('.deck').removeEventListener('click', openCard);
    /* hide Game Over message from display */
    document.querySelector('.msgbox').style.visibility = "hidden";
    /* reset moves counter to zero */
    document.querySelector('.moves').textContent = 0;
    clearInterval(timer);
    timer = null;
    firstClick=true;
    totalSeconds=-1;
    setTime();
    clearStars();
    shuffle(icons);
    const newCards = [];

    /* Get required number of icons depending on the number of pairs the user selects)*/
    /* Get all input fields from the screen and parse through them to find the selected grid size */
    const allInputs = document.getElementsByTagName('input');
    for (let x = 0; x < allInputs.length; x++) {
        if (allInputs[x].name === 'gridSize' && allInputs[x].checked) {
            numPairs = allInputs[x].value;
            x = allInputs.length;  /* found the right one - force loop to stop */
        }
    }
    
    /* rebuild card array - 2 of each card */
    for (let pair = 0; pair <= numPairs-1; pair++) {
        for (let ctr = 0; ctr <= 1; ctr++) {
            newCards[pair*2+ctr] = icons[pair];
        }
    }
    
    /* shuffle cards */
    shuffle(newCards);

    const oldDeck = document.querySelector('.deck');
    const newDeck = document.createElement('ul');
    newDeck.className='deck';

    /* build new deck */
    numCards = newCards.length;
    for (let cardNo = 0; cardNo <= numCards-1; cardNo++) {
        const newLi = document.createElement('li');
        newLi.className = 'card';
            newI = document.createElement('i')
            newI.className = 'fa ' +  newCards[cardNo];
            newLi.appendChild(newI);
        newDeck.appendChild(newLi);
    }

    /* replace deck on screen with new deck */
    oldDeck.parentNode.replaceChild(newDeck, oldDeck);

    /* set card height & width based on number of pairs*/
    if (numPairs == 8) {
        cardHeight = '125px';
        cardWidth = '125px';
    } else if (numPairs == 10) {
        cardHeight = '100px';
        cardWidth = '125px';
    } else {
        cardHeight = '100px';
        cardWidth = '90px';
    };

    let allCards = document.getElementsByClassName('card');
    for (var ctr = 0; ctr < allCards.length; ctr++) {
        allCards[ctr].style.height=cardHeight;
        allCards[ctr].style.width=cardWidth;
    }

    /* turn listener back on */
    document.querySelector('.deck').addEventListener('click', openCard);
}

/*****  Shuffle an array  *****/
// Shuffle function from http://stackoverflow.com/a/2450976  
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*****  Open clicked card  *****/
function openCard(selectedCard) {
    if (firstClick) {
        timer = setInterval(setTime, 1000); /*starts the timer*/
        firstClick=false;
    }
    if (selectedCard.target.classList.contains('card') &&
    !selectedCard.target.classList.contains('open') &&
    !selectedCard.target.classList.contains('match')) {
        if (firstPick === 0)  {
            firstCard = selectedCard.target;
            firstCardIcon = selectedCard.target.children[0].className;
            firstPick = 1;
            selectedCard.target.className = "card open show";
        } else if (secondPick === 0) {
            secondCard = selectedCard.target;
            secondCardIcon = selectedCard.target.children[0].className;
            secondPick = 1;
            selectedCard.target.className = "card open show";
            /* increment number of moves on screen */
            document.querySelector('.moves').textContent++;
            checkStar();
            checkMatch();
        }
    }
}

/*****  Determine if two open cards match  *****/
function checkMatch () {
    if (firstCardIcon === secondCardIcon) {
        /* match cards and delay all game resets*/
        setTimeout(function () {
            firstCard.className = 'card match';
            secondCard.className = 'card match';
            firstPick = 0;
            secondPick = 0;
            firstCardIcon = "";
            secondCardIcon = "";
            /*Determine if game is over*/
            numMatches++
            if (numMatches == numPairs) {
                document.querySelector('.score').textContent=("Number of moves: " + document.querySelector('.moves').textContent)
                document.querySelector('.msgbox').style.visibility = "visible";
                numMatches = 0;
                clearInterval(timer);
                timer = null;
                firstClick=true;
            }
        }, 500);
    } else {
        /* flip cards back over using close class */
        setTimeout(function () {
            firstCard.className = 'card close';
            secondCard.className = 'card close';
        }, 700);
        /* remove close class and delay all game resets*/
        setTimeout(function () {
            firstCard.className = 'card';
            secondCard.className = 'card';
            firstPick = 0;
            secondPick = 0;
            firstCardIcon = "";
            secondCardIcon = "";
        }, 900);
    }
}

function clearStars() {
    oldStars = document.querySelector('.stars')
    newStars = document.createElement('ul');
    newStars.className='stars';

    for (var ctr = 1; ctr <= 5; ctr++) {
        const newLi = document.createElement('li');
        const newI = document.createElement('i')
        newI.className = 'fa fa-star';
        newLi.appendChild(newI);
        newStars.appendChild(newLi);
    }
    oldStars.parentNode.replaceChild(newStars, oldStars);
}

function resetDeck() {
    /* cycle through all the cards and reset their classes to just card*/
    let theCards = document.getElementsByClassName('card');
    for (var ctr = 0; ctr < theCards.length; ctr++) {
        theCards[ctr].className = 'card';
    }
    
    /* reset other variables */
    firstPick = 0;
    secondPick = 0;
    firstCardIcon = "";
    secondCardIcon = "";
    numMatches = 0;
    totalSeconds=0;
    clearInterval(timer);
    timer=null;
    firstClick=true;
    totalSeconds = -1
    setTime();
    document.querySelector('.moves').textContent = 0;
}

function setTime() {
    ++totalSeconds;
    secondsLbl.innerHTML = pad(totalSeconds % 60);
    minutesLbl.innerHTML = pad(parseInt(totalSeconds / 60));
}
  
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function checkStar() {
    let numStars = document.getElementsByClassName('fa-star');
    let numMoves = document.querySelector('.moves').textContent;
    let ratio = numMoves / numPairs;
    console.log("ratio: " + ratio);
    if (ratio >= 1.8 && numStars.length === 5) {
        removeStar();
    } else if (ratio >= 2.2 && numStars.length === 4)  {
        removeStar ();
    } else if (ratio >= 2.5 && numStars.length === 3) {
        removeStar();
    } else if (ratio >= 3 && numStars.length === 2) {
        removeStar();
    }
}

function removeStar() {
    let numStars = document.getElementsByClassName('fa-star');
    if (numStars.length > 1) {
        tempStar = document.querySelector('.stars')
        tempStar.removeChild(tempStar.firstChild)
    }
}

/**********  Initial page load sequence **********/
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* Add listener to deck */
document.querySelector('#resetGame').addEventListener('click', resetDeck);
document.querySelector('#newGame').addEventListener('click', buildDeck);

/* first time the page is loaded, build the deck with default 4x4 size*/
buildDeck();


