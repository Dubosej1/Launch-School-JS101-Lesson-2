const READLINE = require('readline-sync');

prompt("Welcome to the loan calculator!");

while (true) {
  let message;
  
  // Ask User for Loan Amount
  message = "What is the loan amount in dollars?";
  let loanAmount = requestUserInput(message, validateLoanAmount);
 
  // Ask User for APR
  message = "What is the APR? (in % or decimal format)";
// let apr = requestUserInput(message, validateAPR);
  
}

function prompt (message) {
  console.log(message);
}

function requestUserInput(message, validateInput) {
  let requestedInput;
  
  prompt(message);
  let userInput = READLINE.question();
  
  // Validate user input
  while (true) {
    let [errorMessage, num] =  validateInput(userInput);
  
    if (errorMessage) {
      prompt(errorMessage);
      userInput = READLINE.question();
      continue;
    }
    requestedInput = Number(num);
    break;
  }
  return requestedInput;
}

function validateLoanAmount(input) {
    let errorMessage = null;
  
    // Check str for $ sign and parse out
    if (input[0] === '$') {
      input = input.slice(1);
    }
  
   // Check if str is a valid number
    if (input.trimStart() === '' || Number.isNaN(Number(input))) {
      errorMessage = "Not a valid number.  Please try again.";
    }
  
    return [errorMessage, input];
}



// function charCounter(string, searchChar) {
//   let count = 0;
  
//   for (let char of string) {
//     if (char === searchChar) {
//       count += 1;
//     }
//   }
  
//   return count;
// }

