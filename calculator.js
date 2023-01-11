const MESSAGES = require('./calculator_messages.json');
const readline = require('readline-sync');

const LANG = 'en';


function prompt(key) {
  let message = messages(key, LANG);
  console.log(`=> ${message}`);
}

function invalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

function messages(message, lang='en') {
  return MESSAGES[lang][message];
}

prompt('welcome');

let programActive = true;

do {
  // Ask the user for the first number

prompt("firstNumber");
let number1 = readline.question();

while (invalidNumber(number1)) {
  prompt("wrongNumber");
  number1 = readline.question();
}


// Ask the user for the second number

prompt("secondNumber");
let number2 = readline.question();

while (invalidNumber(number2)) {
  prompt("wrongNumber");
  number2 = readline.question();
}

// Ask the user for an operation to perform.

prompt("operation");
let operation = readline.question();

while (!['1', '2', '3', '4'].includes(operation)) {
  prompt("wrongOperation");
  operation = readline.question();
}

// Perform the operation on the 2 numbers.

let output;

switch (operation) {
  case '1':
    output = Number(number1) + Number(number2);
    break;
  case '2':
    output = Number(number1) - Number(number2);
    break;
  case '3':
    output = Number(number1) * Number(number2);
    break;
  case '4':
    output = Number(number1) / Number(number2);
    break;
}
// Print the result to the terminal.

console.log(`The result is: ${output}`);

// Ask user for another calculation

prompt("continueProgram");
let performCalc = readline.question();

while (!['yes', 'no'].includes(performCalc.toLowerCase())) {
  prompt("wrongChoice");
  performCalc = readline.question();
}

if (performCalc.toLowerCase() === 'yes') {
  continue;
} else {
  programActive = false;
}
  
} while (programActive);



