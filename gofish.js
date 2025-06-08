const dealBtn = document.getElementById("deal-btn");
const restartBtn = document.getElementById("restart");
const dialog = document.getElementById("go-fish");
const playerCardsDiv = document.getElementById("player-cards");
const dealerCardsDiv = document.getElementById("dealer-cards");
const dealerCollectedCards = document.getElementById("collected-dealer-cards");
const playerCollectedCards = document.getElementById("collected-player-cards");
const dealerDialog = document.getElementById("dealer-dialog");
const backgroundOptionMenu = document.getElementById("select-menu");
const backgroundOption = document.querySelectorAll(".option");
const deck = document.getElementById("deck");

let dealerCardValues = [];
let playerCardValues = [];
let lastNumCall;
let fishFirst = false;
let dealerTurn;
let cardsDealt = false;

const updateCardId = () => {
    const dealerCards = document.querySelectorAll(".dealer-card");
    const playerCards = document.querySelectorAll(".player-card");

    for(let i = 0; i < playerCards.length; i++) {
        playerCards[i].id = `${i}`;
    };

    for(let i = 0; i < dealerCards.length; i++) {
        dealerCards[i].id = `dealer-${i}`;
    };

    backgroundChange();
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

    backgroundChange();
    return;
};


const cardClick = (target, id) => {
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

    /*
        if dealer array number = id of card clicked

        remove "playerCard" class - this will effect style
        add clicked card to collected cards div

        remove value from player array using target id
        remove value from dealer array using i
        remove dealer card i from the dealer card div
    */

    for(let i = dealerCardValues.length - 1; i >= 0; i--) {
        if(dealerCardValues[i] === playerCardValues[id] && firstMatch) {
            const dealerCards = document.querySelectorAll(".dealer-card");
            console.log("--problem point passed--");
            console.log("Card clicked match: ", dealerCardValues[i]);
            target.classList.remove("player-card");
            playerCollectedCards.appendChild(target);
            playerCardValues.splice(id, 1);
            dealerCardValues.splice(i, 1);
            dealerCards[i].remove();
            goFish = false;
            updateCardId();
            firstMatch = false
        } else if(dealerCardValues[i] === playerCardValues[id] && !firstMatch) {
            const dealerCards = document.querySelectorAll(".dealer-card");
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
    backgroundChange();
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

    if(lastNumCall === randomNum && randomNum < dealerCardValues.length - 1) {
        console.log("last number < length");
        randomNum += 1;
    } else if(lastNumCall === randomNum && randomNum === dealerCardValues.length - 1) {
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
        for(let i = playerCardValues.length - 1; i >= 0; i--) {
            if(playerCardValues[i] === pickCardValue) {
                const dealerCards = document.querySelectorAll(".dealer-card");
                console.log("card match", playerCardValues[i]);
                playerCardValues.splice(i, 1);
                dealerCardValues.splice(randomNum, 1);
                dealerCollectedCards.appendChild(document.getElementById(`dealer-${randomNum}`));
                document.getElementById(`dealer-${randomNum}`).classList.add("face-card");
                document.getElementById(`dealer-${randomNum}`).innerHTML = `
                    <p>
                        ${pickCardValue}
                    </p>
                `;
                document.getElementById(`dealer-${randomNum}`).classList.remove("dealer-card");
                document.getElementById(`${i}`).remove();
                dealerFish = false;
                dealerTurn = true;
                console.log("player array after match: ", playerCardValues);
                console.log("dealer array after match: ", dealerCardValues);
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
    backgroundChange();
    updateCardId();
    return;
};


dealBtn.addEventListener("click", () => {
    if(!cardsDealt) {
        dealPlayerCards();
        return;
    } else if(cardsDealt) {
        return;
    };
});


restartBtn.addEventListener("click", () => {
    location.reload(true);
    return;
});


playerCardsDiv.addEventListener("click", (event) => {
    updateCardId();
    console.log(event.target.id, event.target);
    cardClick(event.target, event.target.id);
    return;
});


const backgroundChange = () => {
    const dealerCards = document.querySelectorAll(".dealer-card");

    if(backgroundOptionMenu.value === "fish-card") {
        dealerCards.forEach(card => {
            card.style.backgroundImage = `url("https://res.cloudinary.com/dbuwekmex/image/upload/c_fill,w_65,h_100/v1749327259/fish-pattern-wallpaper-background_eoa0wo.jpg")`;

        });
        
        deck.style.backgroundImage = `url("https://res.cloudinary.com/dbuwekmex/image/upload/c_fill,w_65,h_100/v1749327259/fish-pattern-wallpaper-background_eoa0wo.jpg")`;
        
    } else if(backgroundOptionMenu.value === "red-card") {
        dealerCards.forEach(card => {
            card.style.backgroundImage = `url("https://res.cloudinary.com/dbuwekmex/image/upload/v1748872353/Screenshot_2025-06-02_9.51.19_AM_insiek.png")`;
        });

        deck.style.backgroundImage = `url("https://res.cloudinary.com/dbuwekmex/image/upload/v1748872353/Screenshot_2025-06-02_9.51.19_AM_insiek.png")`;
    };
};

document.addEventListener('DOMContentLoaded', backgroundChange)

backgroundOptionMenu.addEventListener('change', backgroundChange);