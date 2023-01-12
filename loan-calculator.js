const READLINE = require('readline-sync');

prompt("Welcome to the loan calculator!");

while (true) {
  let message;
  
  // Ask User for Loan Amount
  message = "What is the loan amount in dollars?";
  let loanAmount = requestUserInput(message, validateLoanAmount);
  console.log(loanAmount);
 
  // Ask User for APR
  message = "What is the APR? (in % or decimal format)";
  let apr = requestUserInput(message, validateAPR);
  console.log(apr);
  
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
      errorMessage = "Not a valid number.  Please try again...";
    }
    
    if (+input < 0) {
      errorMessage = "Input must be positive.  Please try again...";
    }
  
    return [errorMessage, +input];
}

function validateAPR (input) {
      let errorMessage = null;
      let percentUsed = false;
  
    // Check str for % sign and parse out
    if (input.slice(-1) === '%') {
      percentUsed = true;
      input = input.slice(0, -1);
    }
  
   // Check if str is a valid number
    if (input.trimStart() === '' || Number.isNaN(Number(input))) {
      errorMessage = "Not a valid number.  Please try again.";
      return [errorMessage, input];
    }
    
    // Convert int to float if necessary
    if (Number.isInteger(Number(input)) || percentUsed) {
      input = +input * 0.01;
    }
    
    // Check for positive num
    if (input < 0) {
      errorMessage = "Input must be positive.  Please try again.";
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

