const dealBtn = document.getElementById("deal-btn");
const restartBtn = document.getElementById("restart");
const dialog = document.getElementById("go-fish");
const playerCardsDiv = document.getElementById("player-cards");
const dealerCardsDiv = document.getElementById("dealer-cards");
const dealerCollectedCards = document.getElementById("collected-dealer-cards");
const playerCollectedCards = document.getElementById("collected-player-cards");
const dealerDialog = document.getElementById("dealer-dialog");

let dealerCardValues = [];
let playerCardValues = [];
let lastNumCall;
let fishFirst = false;
let dealerTurn;

const updateCardId = () => {
    const dealerCards = document.querySelectorAll(".dealer-card");
    const playerCards = document.querySelectorAll(".player-card");

    for(let i = 0; i < playerCards.length; i++) {
        playerCards[i].id = `${i}`;
    };

    for(let i = 0; i < dealerCards.length; i++) {
        dealerCards[i].id = `dealer-${i}`;
    };

    console.log("New player array: ", playerCardValues);
    console.log("New dealer array: ", dealerCardValues);
    return;
};

const dealPlayerCards = () => {

    for(let i = 0; i < 5; i++) {
        let randomNum = Math.floor(Math.random() * 10) + 1;
        let newEl = document.createElement("div");
        newEl.id = i;
        newEl.classList.add("face-card");
        newEl.classList.add("player-card");
        newEl.innerHTML = `
        <p>
            ${randomNum}
        </p>
        `;
        playerCardsDiv.appendChild(newEl);
        playerCardValues.push(randomNum);
    };

    for(let i = 0; i < 5; i++) {
        let randomNum = Math.floor(Math.random() * 10) + 1;
        let newEl = document.createElement("div");
        newEl.id = `dealer-${i}`;
        newEl.classList.add("dealer-card");
        dealerCardsDiv.appendChild(newEl);
        dealerCardValues.push(randomNum);
    };
    return;
};


const cardClick = (target) => {
    updateCardId();
    let firstMatch = true;

    if(fishFirst) {
        alert("Go Fish");
        return;
    } else if(dealerTurn) {
        alert("Dealers Turn");
        return;
    };

    let goFish = true;
    console.log("Card clicked: ", target);
    

    for(let i = dealerCardValues.length; i > 0; i--) {
        if(dealerCardValues[i] === playerCardValues[target.id] && firstMatch) {
            console.log("Card clicked match: ", dealerCards[i]);
            playerCollectedCards.appendChild(target);
            playerCardValues.splice(target.id, 1);
            dealerCardValues.splice(i, 1);
            dealerCards[i].remove();
            goFish = false;
            target.classList.remove("player-card");
            updateCardId();
            firstMatch = false
        } else if(dealerCardValues[i] === playerCardValues[target.id] && !firstMatch) {
            console.log("Card clicked second match: ", dealerCards[i]);
            dealerCardValues.splice(i, 1);
            dealerCards[i].remove();
            goFish = false;
            updateCardId();
        };
    };

    firstMatch = true;

    if(goFish) {
        dialog.innerHTML = `
        <button id="go-fish-btn" onclick="goFishBtn()">
            Go Fish!
        </button>
        `;
        fishFirst = true;
        return;
    };
};


const goFishBtn = () => {
    let randomNum = Math.floor(Math.random() * 10) + 1;
    playerCardValues.push(randomNum);

    const addCard = document.createElement("div");
    addCard.id = `${playerCardValues.length - 1}`;
    addCard.classList.add("player-card");
    addCard.classList.add("face-card");
    addCard.innerHTML = `
        <p>
            ${randomNum}
        </p>
    `;
    playerCardsDiv.appendChild(addCard);

    document.getElementById("go-fish-btn").remove();
    goFish = false;
    fishFirst = false;
    dealerTurn = true;
    updateCardId();
    opAi();
};

//card matching is taking cards from dealerCollectedCards
const opAi = () => {
    console.log("AI TURN ACTIVE");
    updateCardId();

    if(!dealerTurn) {
        console.log("dealerTurn problem");
        return;
    };

    dealerTurn = false;
    let dealerFish = true;
    let randomNum = Math.floor(Math.random() * dealerCardValues.length);

    if(lastNumCall === randomNum && randomNum < dealerCardValues.length) {
        console.log("last number < length");
        randomNum += 1;
    } else if(lastNumCall === randomNum && randomNum === dealerCardValues.length) {
        console.log("last number = length");
        randomNum -= 1;
    };

    lastNumCall = randomNum;
    let pickCardValue = dealerCardValues[randomNum];
    console.log("dealer card pick", pickCardValue);

    

    dealerDialog.innerHTML = `
        <p>
            Do you have any ${pickCardValue}s?
        </p>
    `;

    setTimeout(() => {
        for(let i = 0; i < playerCardValues.length; i++) {
            if(playerCardValues[i] === pickCardValue) {
                console.log("card match", playerCards[i]);
                playerCardValues.splice(i, 1);
                dealerCardValues.splice(randomNum, 1);
                dealerCollectedCards.appendChild(document.getElementById(`dealer-${randomNum}`));
                document.getElementById(`${i}`).remove();
                document.getElementById(`dealer-${randomNum}`).classList.remove("dealer-card");
                document.getElementById(`dealer-${randomNum}`).classList.add("face-card");
                document.getElementById(`dealer-${randomNum}`).innerHTML = `
                    <p>
                        ${pickCardValue}
                    </p>
                `;
                dealerFish = false;
                dealerTurn = true;
                updateCardId();
            };

        };

        dealerDialog.innerHTML = ``;

        if(dealerFish) {
            console.log("dealer go fish");
            dealerGoFish();
            return;
        } else if(dealerTurn) {
            opAi();
            return;
        };

        console.log("AI TURN OVER");

    }, 2000);

    return;
};

const dealerGoFish = () => {
    let randomNum = Math.floor(Math.random() * 10) + 1;
    dealerCardValues.push(randomNum);

    const addCard = document.createElement("div");
    addCard.id = `${dealerCardValues.length}`;
    addCard.classList.add("dealer-card");
    dealerCardsDiv.appendChild(addCard);
    updateCardId();
    return;
};


dealBtn.addEventListener("click", () => {
    dealPlayerCards();
    return;
});


restartBtn.addEventListener("click", () => {
    location.reload(true);
    return;
});


playerCardsDiv.addEventListener("click", (event) => {
    updateCardId();

    if(event.target.classList.contains("face-card")) {
        cardClick(event.target);
        return;
    } else {
        console.log("event listener issue 189");
        return;
    };
});