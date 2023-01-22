const readline = require('readline-sync');

const VALID_HANDS = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

const GAME_INPUTS = {
  singleRound: '1',
  best5: '5',
  contSingle: 'c',
  contBest5: 'c',
  stats: 's',
  rules: 'r',
  quit: 'q'
};
let abbrMap = getAbbreviationsFromHands(VALID_HANDS);

const OUTCOMES = {
  rock: {
    win: [['scissors', 'crushes'], ['lizard', 'crushes']],
    lose: [['spock', 'vaporizes'], ['paper', 'covers']],
  },
  paper: {
    win: [['rock', 'covers'], ['spock', 'disproves']],
    lose: [['scissors', 'cuts'], ['lizard', 'eats']],
  },
  scissors: {
    win: [['paper', 'cuts'], ['lizard', 'decapitates']],
    lose: [['rock', 'crushes'], ['spock', 'smashes']],
  },
  lizard: {
    win: [['paper', 'eats'], ['spock', 'poisons']],
    lose: [['rock', 'crushes'], ['scissors', 'decapitates']],
  },
  spock: {
    win: [['scissors', 'smashes'], ['rock', 'vaporizes']],
    lose: [['paper', 'disproves'], ['lizard', 'poisons']],
  }
};

let score = {
  currSingleRoundPlayerWins: 0,
  currSingleRoundCPUWins: 0,
  currSingleRoundTies: 0,
  currBestOfFivePlayerWins: 0,
  currBestOfFiveCPUWins: 0,
  currBestOfFiveTies: 0,
  totalPlayerRoundWins: 0,
  totalCPURoundWins: 0,
  totalRoundTies: 0,
  totalBestOfFiveGameWins: 0,
  totalRoundsPlayed: 0,
  totalBestOfFiveGamesPlayed: 0,

  updateCurrentSingleRoundScore(outcome) {
    switch (outcome) {
      case 'win':
        this.currSingleRoundPlayerWins += 1;
        this.totalPlayerRoundWins += 1;
        break;
      case 'lose':
        this.currSingleRoundCPUWins += 1;
        this.totalCPURoundWins += 1;
        break;
      default:
        this.currSingleRoundTies += 1;
        this.totalRoundTies += 1;
    }
  },

  updateCurrentBestOfFiveScore(outcome) {
    switch (outcome) {
      case 'win':
        this.currBestOfFivePlayerWins += 1;
        this.totalPlayerRoundWins += 1;
        break;
      case 'lose':
        this.currBestOfFiveCPUWins += 1;
        this.totalCPURoundWins += 1;
        break;
      default:
        this.currBestOfFiveTies += 1;
        this.totalRoundTies += 1;
    }
  },

  updateBestOfFiveRoundTotal(outcome) {
    if (outcome === 'win') this.totalBestOfFiveGameWins += 1;
  },

  resetCurrentSingleRoundScores() {
    this.currSingleRoundPlayerWins = 0;
    this.currSingleRoundCPUWins = 0;
    this.currSingleRoundTies = 0;

  },


  resetCurrentBestOfFiveScores() {
    this.currBestOfFivePlayerWins = 0;
    this.currBestOfFiveCPUWins = 0;
    this.currBestOfFiveTies = 0;
  }
};

console.clear();

welcomePlayer();
let options = [`singleRound`,'best5', 'rules', 'quit'];

let gameActive = true;

while (gameActive) {
  let input = decideGameMode(options);

  if (input === "contSingle" || input === "contBest5") {
    if (options.includes("contSingle")) input = "singleRound";
    else input = "best5";
  }

  switch (input) {
    case "singleRound":
      playSingleRoundMode(score);
      options = ['contSingle', 'best5', 'stats', 'rules', 'quit'];
      continue;
    case "best5":
      score.resetCurrentSingleRoundScores();
      playBestOfFiveMode(score);
      options = ['contBest5', 'singleRound', 'stats', 'rules', 'quit'];
      continue;
    case "stats":
      displayStats(score);
      continue;
    case "rules":
      // displayRules();
      continue;
    default:
      gameActive = false;
  }
}

function welcomePlayer() {
  let welcomeMessage = 'Welcome to Rock, Paper, Scissors & More!';

  let border = "*".repeat(welcomeMessage.length + 6);
  let filler = "*" + " ".repeat(welcomeMessage.length + 4) + "*";
  let text = `*  ${welcomeMessage}  *`;
  let message = `${border}\n${filler}\n${text}\n${filler}\n${border}\n`;

  console.log(message);
}

function prompt (message) {
  console.log(`\n=> ${message}`);
}

function decideGameMode(options) {
  let message = constructGameModeOptionsText(options);
  prompt(message);

  let entriesArr = Object.entries(GAME_INPUTS);
  let filteredArr = entriesArr.filter(pair => options.includes(pair[0]));
  let validInputs = filteredArr.map(pair => pair[1]);


  while (true) {
    let input = readline.question();

    if (validInputs.includes(input)) {
      return getKeyByValue(GAME_INPUTS, input);
    } else {
      prompt("Invalid input....Please try again...\n");
    }
  }
}

function constructGameModeOptionsText(options) {
  let message = "\n";

  let hasCont = options.includes('contSingle') || options.includes('contBest5');
  if (hasCont) message = constructContinueRoundText(message, options);

  if (options.includes('singleRound')) {
    message += "Press '1' to play a single round\n";
  }

  if (options.includes('best5')) {
    message += "Press '5' to play Best of Five rounds\n";
  }

  if (options.includes("stats")) {
    message += "Press 's' to display game stats\n";
  }

  let hasInfo = options.includes('rules') || options.includes('quit');
  if (hasInfo) message = constructGameInfoText(message, options);

  return message;
}

function constructContinueRoundText(message, options) {
  if (options.includes('contSingle')) {
    message += "Press 'c' to play another round\n";
  } else {
    message += "Press 'c' to continue playing Best of Five games\n";
  }
  return message;
}

function constructGameInfoText(message, options) {
  if (options.includes('rules')) {
    message += "Press 'r' to display game rules\n";
  }

  if (options.includes('quit')) {
    message += "Press 'q' to quit game.";
  }
  return message;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function playSingleRoundMode(score) {
  console.clear();

  let border = `===============\n`;
  let welcomeMessage = `\nROUND`;
  console.log(border + welcomeMessage);

  let round = playRound();

  score.updateCurrentSingleRoundScore(round.outcome);

  displayRoundOutcome(round);
  displaySingleRoundScore(score);
}

function playBestOfFiveMode(score) {
  displayWelcomeBestFiveText();
  score.totalBestOfFiveGamesPlayed += 1;

  let roundNum = 1;

  while (true) {
    if (roundNum !== 1) console.clear();

    displayRoundNum(roundNum);

    let round = playRound();

    score.updateCurrentBestOfFiveScore(round.outcome);

    displayBestFiveRoundInfo(round, score);

    let bestOfFiveOutcome = determineBestOfFiveOutcome(score);

    if (bestOfFiveOutcome) {
      executeBestFiveEndingSequence(bestOfFiveOutcome, score);
      return;
    }

    roundNum += 1;
  }
}

function displayWelcomeBestFiveText() {
  console.clear();

  let welcomeMessage = "Now Playing 'Best of Five' mode!\n";
  console.log(welcomeMessage);
}

function displayRoundNum(roundNum) {
  let border = `===============\n\n`;
  let roundMsg = `ROUND ${roundNum}`;
  console.log(border + roundMsg);
}

function displayBestFiveRoundInfo(round, score) {
  displayRoundOutcome(round);
  displayBestOfFiveScore(score);

  readline.question("\nPress [Enter] to continue...");
}

function executeBestFiveEndingSequence(bestOfFiveOutcome, score) {
  displayBestOfFiveOutcome(bestOfFiveOutcome);

  score.updateBestOfFiveRoundTotal(bestOfFiveOutcome);
  score.resetCurrentBestOfFiveScores();
}

function playRound() {
  let round = {};

  score.totalRoundsPlayed += 1;

  round.playerHand = getPlayerHandChoice();
  round.computerHand = getCPUHandChoice();

  let [roundOutcome, action] = decideWinner(round);
  round.outcome = roundOutcome;
  round.handAction = action;

  return round;
}

function getPlayerHandChoice() {
  let turnMsg = "Player's Turn";
  let choiceMsg = "CHOOSE: [r]ock, [p]aper, [sc]issors, [l]izard or [sp]ock.";
  let message = `\n${turnMsg}\n${choiceMsg}`;
  prompt(message);

  while (true) {
    let input = readline.question();

    if (VALID_HANDS.includes(input)) return input;
    else if (abbrMap.has(input)) return abbrMap.get(input);
    else prompt("Invalid input.  Please try again...");
  }
}

function getCPUHandChoice() {
  let randomIndex = Math.floor(Math.random() * VALID_HANDS.length);
  return VALID_HANDS[randomIndex];
}

function decideWinner({playerHand, computerHand}) {
  let findCallbk = (arr) => arr[0] === computerHand;
  let winningHand = OUTCOMES[playerHand].win.find(findCallbk);
  let losingHand = OUTCOMES[playerHand].lose.find(findCallbk);

  if (playerHand === computerHand) return ['tie', 'cancels'];

  if (losingHand) return ['lose', losingHand[1]];

  return ['win', winningHand[1]];
}

function displayRoundOutcome(round) {
  let playerHand = round.playerHand.toUpperCase();
  let computerHand = round.computerHand.toUpperCase();
  let {outcome, handAction} = round;

  let playerMsg = `\nYou chose ${playerHand}\n`;
  let computerMsg = `Computer chooses ${computerHand}\n`;

  let playerOrderMsg = `${playerHand} ${handAction} ${computerHand}... `;
  let computerOrderMsg = `${computerHand} ${handAction} ${playerHand}... `;
  let battleMsg = outcome === 'lose' ? computerOrderMsg : playerOrderMsg;

  let roundOutcomeMsg;
  if (outcome === "win") roundOutcomeMsg = `You WIN round!!`;
  else if (outcome === "lose") roundOutcomeMsg = "Computer wins round...";
  else roundOutcomeMsg = "Round ends in a tie.";

  let message = `${playerMsg}${computerMsg}\n${battleMsg}${roundOutcomeMsg}`;
  prompt(message);


}

function displaySingleRoundScore(score) {
  let playerScore = score.currSingleRoundPlayerWins;
  let computerScore = score.currSingleRoundCPUWins;
  let ties = score.currSingleRoundTies;

  let playersScoreMsg = `Player: ${playerScore} Computer: ${computerScore}`;
  let tiesMsg = `Ties: ${ties}`;
  let scoreMsg = `\nRounds won- ${playersScoreMsg} ${tiesMsg}`;

  console.log(scoreMsg);
}

function displayBestOfFiveScore(score) {
  let playerScore = score.currBestOfFivePlayerWins;
  let computerScore = score.currBestOfFiveCPUWins;
  let ties = score.currBestOfFiveTies;

  let playersScoreMsg = `Player: ${playerScore} Computer: ${computerScore}`;
  let tiesMsg = `Ties: ${ties}`;
  let scoreMsg = `\nRounds won: ${playersScoreMsg} ${tiesMsg}`;

  console.log(scoreMsg);
}

function determineBestOfFiveOutcome (score) {
  const ROUNDS_NEEDED_TO_WIN = 3;

  if (score.currBestOfFivePlayerWins === ROUNDS_NEEDED_TO_WIN) return 'win';
  else if (score.currBestOfFiveCPUWins === ROUNDS_NEEDED_TO_WIN) return 'lose';
  else return null;
}

function displayBestOfFiveOutcome (outcome) {
  let message;

  if (outcome === 'win') {
    message = `You have won best of five games!  Congratulations!!!`;
  } else {
    message = `Computer has won best of five games.  Sorry....`;
  }

  console.clear();

  console.log(message);
}

function getAbbreviationsFromHands(HANDS) {
  let abbrMap = new Map();

  for (let hand of HANDS) {
    let index = 0;
    let char = "";
    let filterCondition = elem => elem.includes(char) && elem[0] === char[0];

    while (true) {
      char += hand[index];
      let duplicateArr = HANDS.filter(filterCondition);

      if (duplicateArr.length === 1) break;
      else index += 1;
    }
    abbrMap.set(char, hand);
  }

  return abbrMap;
}

function displayStats() {
  console.clear();

  let border = `===============\n\n`;
  console.log(border + `Game Stats\n`);

  let message1 = constructIndRoundStatText(score);
  let message2 = constructBestFiveStatText(score);

  console.log(message1 + message2);
}

function constructIndRoundStatText(score) {
  let totalPlayerWins = score.totalPlayerRoundWins;
  let totalCPUWins = score.totalCPURoundWins;
  let totalTies = score.totalRoundTies;
  let totalRounds = score.totalRoundsPlayed;

  let totalRoundHeader = `Total Individual Round Wins:\n`;
  let totalPlayerMsg = `- Player: ${totalPlayerWins}\n`;
  let totalCPUMsg = `- Computer: ${totalCPUWins}\n`;
  let totalTiesMsg = `- Ties : ${totalTies}\n`;
  let totalRoundMsg = `${totalPlayerMsg}${totalCPUMsg}${totalTiesMsg}`;
  let totalRoundPlayedMsg = `Total Rounds Played: ${totalRounds}\n\n`;
  let message = totalRoundHeader + totalRoundMsg + totalRoundPlayedMsg;

  return message;
}

function constructBestFiveStatText(score) {
  let best5Wins = score.totalBestOfFiveGameWins;
  let best5GamesPlayed = score.totalBestOfFiveGamesPlayed;

  let best5WinsMsg = `Total Best of Five Games Won: ${best5Wins}\n`;
  let best5PlayedHeader = `Total Best of Five Games Played: `;
  let best5PlayedMsg = best5PlayedHeader + best5GamesPlayed + '\n';
  let message = best5WinsMsg + best5PlayedMsg;

  return message;
}