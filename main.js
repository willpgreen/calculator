// for checking
// const showFirstNumber = document.getElementById('show-first');
// const showSecondNumber = document.getElementById('show-second');
// const showOperator = document.getElementById('show-operator');
// const showKeyType = document.getElementById('show-key-type');
// const showPreviousKeyType = document.getElementById('show-prev-key');
// const showHold = document.getElementById('show-hold');

const container = document.querySelector('#container');
const display = document.querySelector('#display');
const numbers = document.querySelectorAll('.number');
const clear = document.querySelector('#clear');
const decimal = document.querySelector('#decimal');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('#equals');

// declare place holder variables
let firstNumber = null;
let secondNumber = null;
let midFunction = false;
let action = null;
let previousAction = null;
let holdAction = null;
let holdNumber = null;
let nextAction = null;

let keyType = null;
let previousKeyType = null;

// function updateCheck() {
//     // if (firstNumber) showFirstNumber.innerText = firstNumber;
//     // if (action) showOperator.innerText = action;
//     // if (secondNumber) showSecondNumber.innerText = secondNumber;
//     showFirstNumber.innerText = firstNumber;
//     showOperator.innerText = action;
//     showSecondNumber.innerText = secondNumber;
//     showHold.innerText = holdNumber;
// }

function displayKeyType() {
    showKeyType.innerText = keyType;
    showPreviousKeyType.innerText = previousKeyType;
}


// function to display button number inside display
function displayNumber() {
    // update information on keys pressed
    previousKeyType = keyType;
    keyType = "number";
    // displayKeyType();

    // update clear button
    if (clear.innerText === "AC") clear.innerText = "CE";

    // if user just hit equal, hitting a number starts a new calculation
    if (previousKeyType === "calculate") {
        firstNumber = null;
        secondNumber = null;
        action = null;
        holdAction = null;
    }

    // Remove .is-depressed class from all keys
    Array.from(this.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

    if (display.innerText === "0" || midFunction || previousKeyType === "calculate") {
        midFunction = false;
        display.innerText = "";
    }
    display.innerText += this.innerText;
}

// function to clear display
function clearDisplay() {
    // update information on keys pressed
    previousKeyType = keyType;
    keyType = "clear";
    // displayKeyType();

    // Remove .is-depressed class from all keys
    // Array.from(this.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

    // this.classList.add('is-depressed');
    if (clear.innerText === "AC") {
        firstNumber = null;
        secondNumber = null;
        midFunction = false;
        action = null;
        holdAction = null;
        holdNumber = null;
    }
    
    display.innerText = "0";
    clear.innerText = "AC";
    // updateCheck();
}

// function to add decimal
function displayDecimal() {
    // update information on keys pressed
    previousKeyType = keyType;
    keyType = "number";
    // displayKeyType();

    // update clear button
    if (clear.innerText === "AC") clear.innerText = "CE";

    // Remove .is-depressed class from all keys
    Array.from(this.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

    // if user just hit equal, hitting a number starts a new calculation
    if (previousKeyType === "calculate") {
        firstNumber = null;
        secondNumber = null;
        action = null;
        previousAction = null;
    }

    // depress key pressed
    this.classList.add('is-depressed'); 

    // return if screen already has decimal
    if (display.innerText.includes(".") && previousKeyType === "number") {
        return;
    }

    // if (midFunction) {
    if (previousKeyType != "number") {
        midFunction = false;
        display.innerText = "0";
    }
    display.innerText += this.innerText;
}

// function to retain operator information
function storeOperator() {
    // update information on keys pressed
    previousKeyType = keyType;
    keyType = "operator";
    // displayKeyType();
    nextAction = this.innerText;

    // update clear button
    if (clear.innerText === "AC") clear.innerText = "CE";

    // if user has already provided information for a calulation, calculate
    if (keyType && firstNumber && !(previousKeyType === "operator" || previousKeyType === "calculate")) calculate();
    nextAction = null;

    // Remove .is-depressed class from all keys
    Array.from(this.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
    this.classList.add('is-depressed');

    
    if (!holdAction) firstNumber = Number(display.innerText);
    // if (!(holdAction && (nextAction === "x" || nextAction === "÷"))) firstNumber = Number(display.innerText);

    previousAction = action;
    action = this.innerText;

    // store low precedence operator
    if (action === "+" || action === "-") {
        holdAction = action;
        // console.log("Holding action");
    } 

    midFunction = true;
    // updateCheck();
    
}

// 1 + 2 * 3 = 7
   
function calculate() {
    console.log("calculate");
    if (keyType != "operator") {
        // update information on keys pressed, but only if user hit equal
        previousKeyType = keyType;
        keyType = "calculate";
        // holdAction = null;
        // holdNumber = null;
    }
    // displayKeyType();

    // clear old second number value
    // secondNumber = null;

    // if consecutive calculation, result should move to fistNumber
   if (previousKeyType === "calculate") {
        firstNumber = Number(display.innerText);    
   } else {
       
        // // if storing low precendence operator, number on screen will need to be held
        // if (holdAction && (nextAction === "x" || nextAction === "÷")) {
        //     holdNumber = Number(display.innerText);
        //     console.log("Holding number " + holdNumber);
        // }
        
        // // store low precedence operators incase user inputs one of higher precedence
        // if (action === "+" || action === "-") {
        //     holdAction = action;
        //     console.log("Holding action");
        // } else {
        //     console.log("Not");
        // }

        
        
        // if holding a number, second number should be result of that number and previous calculation
        // console.log(keyType);
    
        // if (holdNumber &&  keyType === "calculate") {
        if (holdNumber) {
            if (action === "+") {
                secondNumber = Number(display.innerText) + holdNumber;   
            } else if (action === "-") {
                secondNumber = holdNumber - Number(display.innerText);;  
            } else if (action === "x") {
                secondNumber = Number(display.innerText) * holdNumber;
            } else if (action === "÷") {
                if (Number(display.innerText) === 0) {
                    clear.innerText = "AC";
                    clearDisplay();
                    display.innerText = "Undefined";
                    return;
                }
                secondNumber = holdNumber / Number(display.innerText);
            } 

            action = holdAction;
            holdAction = null;
            holdNumber = null;
            
        } else if (holdAction && (nextAction === "x" || nextAction === "÷")) {
            // firstNumber = Number(display.innerText);  
        }
        else {
            //store value on screen as second number
            secondNumber = Number(display.innerText);
        }

        if (holdAction && (nextAction === "x" || nextAction === "÷")) {
            holdNumber = Number(display.innerText);
            // console.log("Holding number " + holdNumber);
        }
   }   
    

    //check if user has provided an operator
    if (!action || (secondNumber != 0 && !secondNumber)) return;
    
    

    // Remove .is-depressed class from all keys
    // Array.from(this.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
    // this.classList.add('is-depressed');
   console.log(action);
    
    if (action === "+") {
        result = firstNumber + secondNumber;   
    } else if (action === "-") {
        result = firstNumber - secondNumber;  
    } else if (action === "x") {
        result = firstNumber * secondNumber;
    } else if (action === "÷") {
        console.log(action);
        if (secondNumber === 0) {
            clear.innerText = "AC";
            clearDisplay();
            display.innerText = "Undefined";
            return;
        }
        result = firstNumber / secondNumber;

    }
    // } else if (!action) {
    //     result = secondNumber;
    // }

    console.log(result);
    midFunction = true;
    if(!(holdAction && (nextAction === "x" || nextAction === "÷"))) {
        display.innerText = Number(result.toFixed(7));
        firstNumber = result;
        // secondNumber = null;
    }

    // updateCheck();
}

// add number and operator button functionality
numbers.forEach(number => number.addEventListener('click', displayNumber));
operators.forEach(operator => operator.addEventListener('click', storeOperator));

// add clear, decimal, equal button functionality
clear.addEventListener('click', clearDisplay);
decimal.addEventListener('click', displayDecimal);
equals.addEventListener('click', calculate);

