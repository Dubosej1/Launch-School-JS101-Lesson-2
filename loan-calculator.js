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
  let monthlyInterestRate = apr / 12;
  console.log(monthlyInterestRate);
  
  // Ask User for Loan Duration
  message = "What is the loan duration? (in months or years)";
  let loanDuration = requestUserInput(message, validateLoanDuration);
  console.log(`${loanDuration} months`);
  
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
      console.log(`apr input: ${input}`);
    }
    
    // Check for positive num
    if (input < 0) {
      errorMessage = "Input must be positive.  Please try again.";
    }
    return [errorMessage, input];
  
}

function validateLoanDuration (input) {
  let errorMessage;
  let acceptedTermsArr = ['m', 'mon', 'month', 'months', 'y', 'yr', 'year', 'years'];
  
  let inputArr = input.trim().split(' ');
  
  let [num, unit] = inputArr;
  
  // Check if user input is a valid number
  if (Number.isNaN(Number(num))) {
    errorMessage = "Not a valid number.  Please try again...";
    return [errorMessage, input];
  }
  
  // Check if user only input a number without unit
  if (inputArr.length === 1) {
    input = Math.ceil(Number(num));
    return [errorMessage, input];
  }
  
  // Checks if user input a valid unit term
  if (!acceptedTermsArr.includes(unit)) {
    errorMessage = "Not a valid term.  Please specify 'months' or 'years'";
    return [errorMessage, input];
  }
  
  // Converts loan duration to months if user specified years
  if (acceptedTermsArr.slice(4).includes(unit)) {
    input = convertYearsToMonths(num);
  } else {
      input = Math.ceil(Number(num));
  }
  
  return [errorMessage, input];
  
  function convertYearsToMonths (years) {
    
    //If years is an int, convert to months
    if (Number.isInteger(+years)) {
      return +years * 12;
    }
    
    //If years is a float, convert decimal to addtional months
    let floatArr = Number(years).toFixed(3).split('.');
    let [intPart, fractionPart] = floatArr;
    
    let extraMonths = 0;
    let numerator = 1;
    
    while (true) {
      if (+fractionPart === 0) break;
      
      extraMonths = extraMonths + 1;
      
      if (+fractionPart <= (numerator / 12) * 1000) break;
      
      numerator = numerator + 1;
    }
    
    return (+intPart * 12) + extraMonths;
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

