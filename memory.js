// some global variables

let scores = document.querySelector('.scores');
scores.hidden = true;

let infobox = document.querySelector('.info-box');

let field = document.querySelector('.field');
field.openCards = [];

let numberOfPlayers;
let players = [];   // provides a reference to the player
let currentPlayer;  // whose turn it currently is

let NumberOfCards;

let modalWindows = document.querySelectorAll('.modal-window'); // provides a reference to the modal 
let currentWindow = 0;                                         // window that is currently displayed                 

let gameInProgress = false;

let storeBox = document.querySelector('.store-box');
let selectedTheme;


// modal dialog for a new game
// functions

let newGameBtn = document.querySelector('.new-game-btn');
newGameBtn.addEventListener('click', startModal);

function startModal() {
    let cover = document.createElement('div');
    cover.className = 'modal-cover';
    document.body.append(cover);
    let window = modalWindows[currentWindow];
    newGameBtn.setAttribute('tabindex', '-1');
    newGameBtn.blur();
    window.style.display = 'block';
}

function nextModal(e) {
    e.preventDefault();
    modalWindows[currentWindow].style.display = 'none';
    currentWindow++;
    modalWindows[currentWindow].style.display = 'block';
}

function previousModal(e) {
    e.preventDefault();

    let window = modalWindows[currentWindow];
    window.style.display = 'none';

    if (window.id == 'modal-player-names') {
        window.querySelector('form').innerHTML = '';
    }

    currentWindow--;
    modalWindows[currentWindow].style.display = 'block';

}

// calculates the number of text inputs in 2nd modal window,  
// creates them and inserts them in the document 

function calcNameModal(e) {
    e.preventDefault()
    let currentForm = e.target.form;
    numberOfPlayers = currentForm.number.value;

    for (let i = 0; i < numberOfPlayers; i++) {

        // create elements
        let label = document.createElement('label');
        label.innerHTML = 'Player ' + (i + 1) + ' ';
        label.setAttribute('for', 'in' + (i + 1));

        let input = document.createElement('input');
        input.id = 'in' + (i + 1);
        input.setAttribute('type', 'text');

        let br = document.createElement('br');

        // insert elements
        let nextModal = document.getElementById('modal-player-names');
        let nextForm = nextModal.querySelector('form')
        nextForm.append(label);
        nextForm.append(input);
        nextForm.append(br);
    }
    modalWindows[currentWindow].querySelector('input').focus();
}

function closeModal(e) {

    e.preventDefault();
    modalWindows[currentWindow].style.display = 'none';
    currentWindow = 0;

    let namesWindow = document.getElementById('modal-player-names');
    namesWindow.querySelector('form').innerHTML = '';

    let cover = document.querySelector('.modal-cover');
    cover.remove();

    newGameBtn.setAttribute('tabindex', '1');
}


// assign handlers for buttons of modal windows

let modWindow1 = document.getElementById('modal-num-of-players');
let modContBtn1 = modWindow1.querySelector('.modal-continue-play-btn');
modContBtn1.addEventListener('click', nextModal);
modContBtn1.addEventListener('click', calcNameModal);

let modWindow2 = document.getElementById('modal-player-names');
let modContBtn2 = modWindow2.querySelector('.modal-continue-play-btn');
modContBtn2.addEventListener('click', nextModal);

let modBackBtn2 = modWindow2.querySelector('.modal-back-btn');
modBackBtn2.addEventListener('click', previousModal);

let modWindow3 = document.getElementById('modal-themes');
let modBackBtn3 = modWindow3.querySelector('.modal-back-btn');
modBackBtn3.addEventListener('click', previousModal);

for (let window of modalWindows) {
    let xBtn = window.querySelector('.modal-x-btn');
    xBtn.onclick = closeModal;
}

// play button of last modal window. starts the game.

let playBtn = document.getElementById('modal-play-btn');
playBtn.addEventListener('click', startGame);
playBtn.addEventListener('click', closeModal);


function startGame() {

    setCursorCardCont(true); // activates cursor when hovering over cards
                            // indicating they can now be flipped

    putCardsInStoreBox();  // in case there was a previous game

    setSelectedTheme();
    NumberOfCards = selectedTheme.querySelectorAll('img').length;

    clearScoreBoard();     //in case there was a previous game
    initScoreBoard();
    initPlayers();
    initField();

    gameInProgress = true;
    currentPlayer = 0;


    let info = 'Click on a Card to flip it.'
    showInfo(info, true);

    scores.hidden = false;
}

// sets the theme selected by user in 3rd modal window

function setSelectedTheme() {
    let themes = modalWindows[currentWindow].querySelectorAll('input');
    for (let theme of themes) {
        if (theme.checked) {
            selectedTheme = document.getElementById(theme.value);
        }
    }
}

// puts remaining cards from playing field back to store box

function putCardsInStoreBox() {
    let cardsOnField = field.querySelectorAll('img');
    if (cardsOnField[0]) {
        for (let card of cardsOnField) {
            selectedTheme.append(card);
        };
    }
}


// initializes score board

function initScoreBoard() {
    for (let i = 0; i < numberOfPlayers; i++) {
        let tr = document.createElement('tr');
        scores.append(tr);
        for (let i = 0; i < 3; i++) {
            let td = document.createElement('td');
            td.innerHTML = '0';
            tr.append(td);
        }
    }
    scores.rows[1].classList.add('current-player');
}

// deletes the players (rows) of previous game from score board 

function clearScoreBoard() {
    if (scores.rows[1]) {
        let x = 0;
        for (let i = scores.rows.length - 1; i > 0; i--) {
            scores.rows[i].remove();
        }
    }
}


// initializes players and fills score board with player names

function initPlayers() {
    players = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        players[i] = {
            name: 'Player' + (i + 1),
            points: 0,
            attempts: 0,
            updateScore: function (matched) {
                if (matched) this.points++;
                this.attempts++;
            },
        }
        let playerName = document.getElementById('in' + (i + 1)).value;
        if (playerName) players[i].name = playerName;
        scores.rows[i + 1].cells[0].innerHTML = players[i].name;
    }
}

// initializes playing field by assigning a random card to each field position

function initField() {
    for (let i = 0; i < field.rows.length; i++) {
        for (let j = 0; j < field.rows[0].cells.length; j++) {
            let NumOfImgs = selectedTheme.querySelectorAll('img').length;
            let randomIndex = Math.floor(Math.random() * NumOfImgs);
            let remainingImgs = selectedTheme.querySelectorAll('img');

            let cardContainer = field.rows[i].cells[j].querySelector('.card-container');
            cardContainer.classList.remove('empty-card-container');

            let img = remainingImgs[randomIndex];
            img.hidden = true;
            cardContainer.append(img);
        }
    }
}


// initializations that happen only with first page load

// assign a matching number to each card pair. done for every card theme

let themes = storeBox.querySelectorAll('div');
for (let theme of themes) {
    let images = theme.querySelectorAll('img');
    for (let i = 0; i < images.length; i++) {
        let x = (i % 2 == 0) ? i : i - 1;
        images[i].pairNo = x;
    }
}


setCursorCardCont(false);

// shows a cursor when hovering over cards to indicate they are now clickable.

function setCursorCardCont(showCursor) {
    for (let container of document.querySelectorAll('.card-container')) {
        if (!showCursor) {
            container.classList.add('card-container-non-clickable')
        } else {
            container.classList.remove('card-container-non-clickable')
        }
    }
}

showInfo("Click New Game to play", true);



// event handlers for playing field

field.addEventListener('click', showCard);

function showCard(e) {
    if (!e.target.classList.contains('card-container')
        || field.openCards.length > 1
        || !gameInProgress) return;
    let img = e.target.querySelector('img');

    if (img) {
        img.hidden = false;
        field.openCards.push(img);

        infobox.innerHTML = '';
    }
    if (field.openCards.length > 1) {
        field.dispatchEvent(new CustomEvent('turnFinished'));
    }
}

field.addEventListener('turnFinished', finishTurn);

// checks if flipped cards matched and calls corresponding function

function finishTurn() {
    let openCards = this.openCards;
    if (openCards[0].pairNo == openCards[1].pairNo) {
        match(openCards[0], openCards[1])
    } else {
        noMatch(openCards[0], openCards[1])
    }
}

// is called if the flipped cards match. puts cards back in storebox.
// updates player scores on the score board

function match(img1, img2) {
    setTimeout(() => {
        img1.parentElement.classList.add('empty-card-container');
        img2.parentElement.classList.add('empty-card-container');
        selectedTheme.append(img1);
        selectedTheme.append(img2);
        field.openCards = [];
    }, 2000)

    let player = players[currentPlayer];
    player.updateScore(true);
    scores.rows[currentPlayer + 1].cells[1].innerHTML = player.points;
    scores.rows[currentPlayer + 1].cells[2].innerHTML = player.attempts;

    let info = "It's a match! "
        + players[currentPlayer].name
        + ", you again!";
    showInfo(info, true);

    NumberOfCards -= 2;     
    if (NumberOfCards == 0) calcWinners(); // check for end of game.
};

// is called in case the flipped cards don't match

function noMatch(img1, img2) {
    setTimeout(() => {
        img1.hidden = true;
        img2.hidden = true;
        field.openCards = [];
    }, 2000)

    let player = players[currentPlayer];
    player.updateScore(false);
    scores.rows[currentPlayer + 1].cells[2].innerHTML = player.attempts;

    let info = "No Match...Next time!";
    showInfo(info, false);

    nextPlayer();
};

// moves on to next player

function nextPlayer() {
    setTimeout(() => {
        scores.rows[currentPlayer + 1].classList.remove('current-player');
        currentPlayer = (currentPlayer + 1) % numberOfPlayers;
        scores.rows[currentPlayer + 1].classList.add('current-player');
    }, 3000)
}

// calculates the winner(s)

function calcWinners() {
    players.sort((player1, player2) => player2.points - player1.points);
    let winners = players[0].name;
    let i = 0;
    let isEqual = true;

    // check if there is more than one winner
    while (isEqual && (i < players.length - 1)) {
        if (players[i].points == players[i + 1].points) { 
            winners += ' and ' + players[i + 1].name
        } else {
            isEqual = false
        };
        i++;
    }
    let info = winners + ' won!';
    showInfo(info, true);
}

// makes info appear in the info box. 
// info disappears after 3s if stay == false.

function showInfo(info, stay) {
    let span = document.createElement('span');
    span.innerHTML = info;
    span.classList.add('neon');
    infobox.innerHTML = '';
    infobox.append(span);
    if (!stay) setTimeout(() => span.remove(), 3000)
}
