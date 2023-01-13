const READLINE = require('readline-sync');

prompt("Welcome to the loan calculator!");

while (true) {
  let message;

  // Ask User for Loan Amount
  message = "What is the loan amount in dollars?";
  let loanAmount = requestUserInput(message, validateLoanAmount);


  // Ask User for APR
  message = "What is the APR? (in % or decimal format)";
  let apr = Number(requestUserInput(message, validateAPR));
  let monthlyInterestRate = apr / 12;

  // Ask User for Loan Duration
  message = "What is the loan duration? (in months or years)";
  let loanDuration = Number(requestUserInput(message, validateLoanDuration));
  let durationUnit = loanDuration === 1 ? 'month' : 'months';

  // Ask user to verify info is correct
  message = `\nLoan Amount: $${loanAmount}\nAPR: ${apr}\nLoan Duration: ${loanDuration} ${durationUnit}\n======\nIs this info correct? (yes/no)`;
  let wrongInfo = requestUserInput(message, validateUserAnswer);

  if (wrongInfo === 'no') continue;

  // Calculate loan payment info

  let loanInfo = [loanAmount, monthlyInterestRate, loanDuration];
  let monthlyPayment = calcMonthlyPayment(loanInfo);
  let totalsArr = calcTotalAmounts(monthlyPayment, loanInfo);
  let [totalLoanPaymentAmount, totalInterestAmount] = totalsArr;

  // Display loan payment info
  // Prompt User to begin program again
  message = `\nMonthly Payment: $${monthlyPayment}\nTotal over ${loanDuration} ${durationUnit}: ${totalLoanPaymentAmount}\nTotal Interest: ${totalInterestAmount}\n======\nWould you like to calculate another loan? (yes/no)`;
  let restartProgram = requestUserInput(message, validateUserAnswer);

  if (restartProgram === 'no') break;
}

function prompt (message) {
  console.log(`=> ${message}`);
}

function requestUserInput(message, validateInput) {
  let requestedInput;

  // Prompt user for input
  prompt(message);
  let userInput = READLINE.question();

  // Validate user input
  while (true) {
    let [errorMessage, result] =  validateInput(userInput);

    if (errorMessage) {
      prompt(errorMessage);
      userInput = READLINE.question();
      continue;
    }
    requestedInput = result;
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

  if (+input <= 1) {
    errorMessage = "Input must be greater than 0.  Please try again...";
  }

  // Convert type to number
  input = +(Number.parseFloat(input).toFixed(2));

  return [errorMessage, input];
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
  let errorMessage = null;
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

  [errorMessage, input] = checkLoanDurationUnit(input, num, unit);

  return [errorMessage, input];

  function checkLoanDurationUnit (input, num, unit) {
    let errorMessage =  null;
    let acceptedTermsArr = ['m', 'mon', 'month', 'months', 'y', 'yr', 'year', 'years'];

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

        extraMonths += 1;

        if (+fractionPart <= (numerator / 12) * 1000) break;

        numerator += 1;
      }

      return (+intPart * 12) + extraMonths;
    }
  }
}

function validateUserAnswer (input) {
  let errorMessage = null;

  input = input.toLowerCase();

  if (!['yes', 'no'].includes(input)) {
    errorMessage = "Invalid input.  Please enter 'yes' or 'no'";
  }

  return [errorMessage, input];
}

function calcMonthlyPayment(loanInfoArr) {

  let [loanAmount, monthlyInterestRate, loanDuration] = loanInfoArr;

  let denominator = (1 - Math.pow((1 + monthlyInterestRate), (-loanDuration)));
  let monthlyPayment = loanAmount * (monthlyInterestRate / denominator);

  return monthlyPayment.toFixed(2);
}

function calcTotalAmounts(monthlyPayments, loanInfoArr) {

  let [loanAmount, monthlyInterestRate, loanDuration] = loanInfoArr;

  let totalLoanPaymentAmount = monthlyPayments * loanDuration;

  let totalInterestAmount = 0;

  //Calculate total interest amount
  for (let month = 1; month <= loanDuration; month++) {
    let currIntPayment = loanAmount * monthlyInterestRate;
    totalInterestAmount = +(currIntPayment.toFixed(2)) + totalInterestAmount;
    loanAmount -= (monthlyPayments - currIntPayment);
  }

  return [totalLoanPaymentAmount, totalInterestAmount];
}

