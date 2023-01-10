const readline = require('readline-sync');

function prompt(message) {
  console.log(`=> ${message}`);
}

prompt('Welcome to Calculator');

// Ask the user for the first number

prompt("What's the first number?");
let number1 = readline.question();


// Ask the user for the second number

prompt("What's the second number?");
let number2 = readline.question();

// Ask the user for an operation to perform.

prompt("What operation would you like to perform?\n1) Add 2) Subtract 3) Multiply 4) Divide?");
let operation = readline.question();
// Perform the operation on the 2 numbers.

let output;
if (operation === `1`) {
  output = Number(number1) + Number(number2);
} else if (operation === '2') {
  output = Number(number1) - Number(number2);
} else if (operation === '3') {
  output = Number(number1) * Number(number2);
} else if (operation === '4') {
  output = Number(number1) / Number(number2);
}
// Print the result to the terminal.

console.log(`The result is: ${output}`);

