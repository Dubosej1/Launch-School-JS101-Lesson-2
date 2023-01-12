const READLINE = require('readline-sync');

function prompt (message) {
  console.log(message);
}

function requestLoanAmount () {
  let loanAmount;
  
  prompt("What is the loan amount in dollars?")
  let userInput = READLINE.question();
  
  // Validate loan amount input
  while (true) {
  let [errorMessage, num] =  validateLoanAmount(userInput);
  
  if (errorMessage) {
    prompt(errorMessage);
    userInput = READLINE.question();
    continue;
  }
  loanAmount = Number(num);
  break;
  }
  return loanAmount;
  
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

prompt("Welcome to the loan calculator!");

while (true) {
  
  // Ask User for Loan Amount
 let loanAmount = requestLoanAmount();
  
}