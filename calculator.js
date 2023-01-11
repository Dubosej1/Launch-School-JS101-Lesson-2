const readline = require('readline-sync');

function prompt(message) {
  console.log(`=> ${message}`);
}

function invalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

prompt('Welcome to Calculator');

let programActive = true;

do {
  // Ask the user for the first number

prompt("What's the first number?");
let number1 = readline.question();

while (invalidNumber(number1)) {
  prompt("Hmm... that doesn't look like a valid number.");
  number1 = readline.question();
}


// Ask the user for the second number

prompt("What's the second number?");
let number2 = readline.question();

while (invalidNumber(number2)) {
  prompt("Hmm... that doesn't look like a valid number.");
  number2 = readline.question();
}

// Ask the user for an operation to perform.

prompt("What operation would you like to perform?\n1) Add 2) Subtract 3) Multiply 4) Divide?");
let operation = readline.question();

while (!['1', '2', '3', '4'].includes(operation)) {
  prompt('Must choose 1, 2, 3, 4');
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

prompt(`The result is: ${output}`);

// Ask user for another calculation

prompt("Would you like to perform another calculation?");
let performCalc = readline.question();

while (!['yes', 'no'].includes(performCalc.toLowerCase())) {
  prompt("Must choose 'yes' or 'no'");
  performCalc = readline.question();
}

if (performCalc.toLowerCase() === 'yes') {
  continue;
} else {
  programActive = false;
}
  
} while (programActive);



