const READLINE = require('readline-sync');

console.clear();
prompt("Welcome to the loan calculator!");

// Main Program Loop
while (true) {
  let loanAmount = requestLoanAmount();

  let [monthlyInterestRate, apr] = requestAPR();

  let [loanDuration, durationUnit] = requestLoanDuration();

  let userInfo = [loanAmount, apr, loanDuration, durationUnit];
  let isInfoCorrect = requestInfoVerification(userInfo);
  if (isInfoCorrect === 'no') continue;

  let loanInfo = [loanAmount, monthlyInterestRate, loanDuration, durationUnit];
  let paymentInfo = calcLoanPaymentInfo(loanInfo);

  displayPaymentInfo(loanInfo, paymentInfo);

  let restartProgram = requestRestartProgram();
  if (restartProgram === 'no') break;
}

function prompt (message) {
  console.log(`=> ${message}`);
}

function displayPaymentInfo (loanInfo, paymentInfo) {
  // Unpack needed variables
  let [ , ,duration, durationUnit] = loanInfo;
  let [monthlyPayment, totalPaymentAmt, totalIntAmt] = paymentInfo;

  // Convert monthlyPayment into $0.00 format
  monthlyPayment = +(monthlyPayment.toFixed(2));

  // Construct message
  let monthPayStr = `Monthly Payment: $${monthlyPayment}`;
  let durationStr = `Total over ${duration} ${durationUnit}: $${totalPaymentAmt}`;
  let totalIntStr = `Total Interest: $${totalIntAmt}`;
  let message = `\n${monthPayStr}\n${durationStr}\n${totalIntStr}`;

  console.clear();
  prompt(message);
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

function requestLoanAmount() {
  let message = "What is the loan amount in dollars?";

  return requestUserInput(message, validateLoanAmount);

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

    // Check if input is greater than 1
    if (+input < 1) {
      errorMessage = "Input must be greater than 1.  Please try again...";
    }

    // Convert type to number
    input = +(Number.parseFloat(input).toFixed(2));

    return [errorMessage, input];
  }
}

function requestAPR () {
  let message = "What is the APR? (in % or decimal format)";
  let apr = requestUserInput(message, validateAPR);
  let monthlyInterestRate = apr / 12;

  return [monthlyInterestRate, apr];

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
    return [errorMessage, +input];

  }

}

function requestLoanDuration() {
  let message = "What is the loan duration? (in months or years)";
  let loanDuration = requestUserInput(message, validateLoanDuration);
  let durationUnit = loanDuration === 1 ? 'month' : 'months';

  return [+loanDuration, durationUnit];

  function validateLoanDuration (input) {
    let errorMessage = null;
    let inputArr = input.trim().split(' ');
    let [num, unit] = inputArr;

    // Check if user input is a valid number
    if (Number.isNaN(Number(num))) {
      errorMessage = "Not a valid number.  Please try again...";
      return [errorMessage, input];
    }

    // Check for positive num
    if (num <= 0) {
      errorMessage = "Input must greater than 1.  Please try again.";
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

      // Checks if user input contains a valid unit term
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
}

function requestInfoVerification (userInfoArr) {
  let [loanAmount, apr, loanDuration, durationUnit] = userInfoArr;

  // Construct message
  let amountStr = `Loan Amount: $${loanAmount}`;
  let aprStr = `APR: ${apr}`;
  let durationStr = `Loan Duration: ${loanDuration} ${durationUnit}`;
  let promptStr = `Is this info correct? (yes/no)`;
  let message = `\n${amountStr}\n${aprStr}\n${durationStr}\n======\n${promptStr}`;

  console.clear();
  let isInfoCorrect = requestUserInput(message, validateUserAnswer);

  return isInfoCorrect;
}

function requestRestartProgram () {
  let message = `Do you want to calculate another loan? (yes/no)`;
  return requestUserInput(message, validateUserAnswer);
}


function validateUserAnswer (input) {
  let errorMessage = null;

  input = input.toLowerCase();

  if (!['yes', 'no'].includes(input)) {
    errorMessage = "Invalid input.  Please enter 'yes' or 'no'";
  }

  return [errorMessage, input];
}

function calcLoanPaymentInfo(loanInfo) {
  let monthlyPayment = calcMonthlyPayment(loanInfo);
  let totalsArr = calcTotalAmounts(monthlyPayment, loanInfo);
  let [totalPaymentAmt, totalIntAmt] = totalsArr;

  return [monthlyPayment, totalPaymentAmt, totalIntAmt];

  function calcMonthlyPayment(loanInfoArr) {

    let [loanAmount, monthlyIntRate, loanDuration] = loanInfoArr;
    let monthlyPayment;

    if (monthlyIntRate === 0) {
      monthlyPayment = loanAmount / loanDuration;
    } else {
      let denominator = (1 - Math.pow((1 + monthlyIntRate), (-loanDuration)));
      monthlyPayment = loanAmount * (monthlyIntRate / denominator);
    }

    return monthlyPayment;
  }

  function calcTotalAmounts(monthlyPayments, loanInfoArr) {

    let [loanAmount, monthlyInterestRate, loanDuration] = loanInfoArr;

    console.log(`MP: ${monthlyPayments} LD: ${loanDuration} MIR: ${monthlyInterestRate}`);

    //Calculate total loan payment amount
    let totalLoanPaymentAmount = monthlyPayments * loanDuration;
    totalLoanPaymentAmount = +(totalLoanPaymentAmount.toFixed(2));

    //Calculate total interest amount
    let totalIntAmt = 0;

    if (monthlyInterestRate === 0) return [totalLoanPaymentAmount, totalIntAmt];

    for (let month = 1; month <= loanDuration; month++) {
      let currIntPayment = loanAmount * monthlyInterestRate;
      totalIntAmt = currIntPayment + totalIntAmt;
      loanAmount -= (monthlyPayments - currIntPayment);
    }

    totalIntAmt = +(totalIntAmt.toFixed(2));

    return [totalLoanPaymentAmount, totalIntAmt];
  }
}


