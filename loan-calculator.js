const READLINE = require('readline-sync');

function prompt (message) {
  console.log(message);
}

function validateLoanAmount(input) {
  let errorMessage = null;
  let parsedInput;
  
  // Check str for $ sign
  if (input.includes('$')) {
    if (input[0] !== '$' || charCounter(input, '$') > 1) {
      errorMessage = `${input} should be in either 0.00 or $0.00 format.  Please try again.`;
      return [errorMessage, input];
    } else {
      input = input.slice(1);
    }
  }
  
  if (input.trimStart() === '' || Number.isNaN(Number(input))) {
    errorMessage = "Not a valid number.  Please try again.";
  }
  
  return [errorMessage, input];
}

function charCounter(string, searchChar) {
  let count = 0;
  
  for (let char of string) {
    if (char === searchChar) {
      count += 1;
    }
  }
  
  return count;
}

prompt("Welcome to the loan calculator!");

while (true) {
  
  // Ask User for Loan Amount
  prompt("What is the loan amount in dollars?")
  let inputLoanAmount = READLINE.question();
  
  // Validate loan amount input
  while (true) {
  let [errorMessage, loanAmount] =  validateLoanAmount(inputLoanAmount);
  
  if (errorMessage) {
    prompt(errorMessage);
    inputLoanAmount = READLINE.question();
    continue;
  }
  break;
  }
  console.log('success');
}