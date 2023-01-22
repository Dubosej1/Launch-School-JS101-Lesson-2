const readline = require('readline-sync');

const VALID_HANDS = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

const GAME_USER_INPUTS = {
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
  singleRoundWins: {
    player: 0,
    cpu: 0,
    ties: 0
  },
  bestFiveWins: {
    player: 0,
    cpu: 0,
    ties: 0,
    game: 0
  },
  totalRoundWins: {
    player: 0,
    cpu: 0,
    ties: 0
  },
  totalRoundsPlayed: 0,
  totalBestFiveGamesPlayed: 0,

  updateCurrentSingleRoundScore(outcome) {
    switch (outcome) {
      case 'win':
        this.singleRoundWins.player += 1;
        this.totalRoundWins.player += 1;
        break;
      case 'lose':
        this.singleRoundWins.cpu += 1;
        this.totalRoundWins.cpu += 1;
        break;
      default:
        this.singleRoundWins.ties += 1;
        this.totalRoundWins.ties += 1;
    }
  },

  updateCurrentBestOfFiveScore(outcome) {
    switch (outcome) {
      case 'win':
        this.bestFiveWins.player += 1;
        this.totalRoundWins.player += 1;
        break;
      case 'lose':
        this.bestFiveWins.cpu += 1;
        this.totalRoundWins.cpu += 1;
        break;
      default:
        this.bestFiveWins.ties += 1;
        this.totalRoundWins.ties += 1;
    }
  },

  updateBestOfFiveRoundTotal(outcome) {
    if (outcome === 'win') this.bestFiveWins.game += 1;
  },

  resetCurrentSingleRoundScores() {
    this.singleRoundWins.player = 0;
    this.singleRoundWins.cpu = 0;
    this.singleRoundWins.ties = 0;
  },

  resetCurrentBestOfFiveScores() {
    this.bestFiveWins.player = 0;
    this.bestFiveWins.cpu = 0;
    this.bestFiveWins.ties = 0;
  }
};

// Main Game Loop

console.clear();

welcomePlayer();
let options = [`singleRound`,'best5', 'rules', 'quit'];

let gameActive = true;

while (gameActive) {
  let input = getGameMode(options);

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
      displayRules();
      continue;
    default:
      gameActive = false;
      displayGoodbyeMsg();
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

function displayGoodbyeMsg() {
  console.log("\nThank you for playing Rock, Paper, Scissors & More!");
}

function prompt (message) {
  console.log(`\n=> ${message}`);
}

function getGameMode(options) {
  let message = constructGameModeOptionsText(options);
  prompt(message);

  let entriesArr = Object.entries(GAME_USER_INPUTS);
  let filteredArr = entriesArr.filter(pair => options.includes(pair[0]));
  let validInputs = filteredArr.map(pair => pair[1]);


  while (true) {
    let input = readline.question();

    if (validInputs.includes(input)) {
      return getKeyByValue(GAME_USER_INPUTS, input);
    } else {
      prompt("Invalid input....Please try again...\n");
    }
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function constructGameModeOptionsText(options) {
  let message = "\n";

  let hasCont = options.includes('contSingle') || options.includes('contBest5');
  if (hasCont) message = constructContinueRoundText(message, options);

  if (options.includes('singleRound')) {
    message += "Press [1] to play a single round\n";
  }

  if (options.includes('best5')) {
    message += "Press [5] to play Best of Five rounds\n";
  }

  if (options.includes("stats")) {
    message += "Press [s] to display game stats\n";
  }

  let hasInfo = options.includes('rules') || options.includes('quit');
  if (hasInfo) message = constructGameInfoText(message, options);

  return message;
}

function constructContinueRoundText(message, options) {
  if (options.includes('contSingle')) {
    message += "Press [c] to play another round\n";
  } else {
    message += "Press [c] to continue playing Best of Five games\n";
  }
  return message;
}

function constructGameInfoText(message, options) {
  if (options.includes('rules')) {
    message += "Press [r] to display game rules\n";
  }

  if (options.includes('quit')) {
    message += "Press [q] to quit game.";
  }
  return message;
}

function playSingleRoundMode(score) {
  displayWelcomeSingleRoundText();

  let round = playRound();

  score.updateCurrentSingleRoundScore(round.outcome);

  displayRoundOutcome(round);
  displaySingleRoundScore(score);
}

function displayWelcomeSingleRoundText() {
  console.clear();

  let border = `===============\n`;
  let welcomeMessage = `\nROUND`;
  console.log(border + welcomeMessage);
}

function playBestOfFiveMode(score) {
  displayWelcomeBestFiveText();
  score.totalBestFiveGamesPlayed += 1;

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

  pauseProgramExecution();
}

function pauseProgramExecution() {
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
    let input = readline.question().toLowerCase();

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
  let playerScore = score.singleRoundWins.player;
  let computerScore = score.singleRoundWins.cpu;
  let ties = score.singleRoundWins.ties;

  let playersScoreMsg = `Player: ${playerScore} Computer: ${computerScore}`;
  let tiesMsg = `Ties: ${ties}`;
  let scoreMsg = `\nRounds won- ${playersScoreMsg} ${tiesMsg}`;

  console.log(scoreMsg);
}

function displayBestOfFiveScore(score) {
  let playerScore = score.bestFiveWins.player;
  let computerScore = score.bestFiveWins.cpu;
  let ties = score.bestFiveWins.ties;

  let playersScoreMsg = `Player: ${playerScore} Computer: ${computerScore}`;
  let tiesMsg = `Ties: ${ties}`;
  let scoreMsg = `\nRounds won: ${playersScoreMsg} ${tiesMsg}`;

  console.log(scoreMsg);
}

function determineBestOfFiveOutcome (score) {
  const ROUNDS_NEEDED_TO_WIN = 3;

  if (score.bestFiveWins.player === ROUNDS_NEEDED_TO_WIN) return 'win';
  else if (score.bestFiveWins.cpu === ROUNDS_NEEDED_TO_WIN) return 'lose';
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
  let totalPlayerWins = score.totalRoundWins.player;
  let totalCPUWins = score.totalRoundWins.cpu;
  let totalTies = score.totalRoundWins.ties;
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
  let best5Wins = score.bestFiveWins.game;
  let best5GamesPlayed = score.totalBestFiveGamesPlayed;

  let best5WinsMsg = `Total Best of Five Games Won: ${best5Wins}\n`;
  let best5PlayedHeader = `Total Best of Five Games Played: `;
  let best5PlayedMsg = best5PlayedHeader + best5GamesPlayed + '\n';
  let message = best5WinsMsg + best5PlayedMsg;

  return message;
}

function displayRules() {
  console.clear();

  let border = `===============\n\n`;
  console.log(border + `Game Rules\n`);

  let directionsTxt = constructGameDirectionsText();
  let bestFiveRulesTxt = constructBestFiveRulesText();
  let winningHandTxt = constructWinningHandText();

  console.log(directionsTxt + bestFiveRulesTxt + winningHandTxt);
}

function constructGameDirectionsText() {
  let header = "Game Directions:\n";

  let txt = "";

  txt += "Player makes a choice from 5 possible hands: rock, paper, ";
  txt += "scissors, lizard or spock.  The computer also makes the same ";
  txt += "choice.  The 2 players then compare their hands.\n\n";

  txt += "Each hand can beat another hands, BUT can also be beaten by yet ";
  txt += "another hand.  For example, Rock beats Scissors, but Paper can ";
  txt += "beat Rock.  A list of all winning hand combinations is below.\n\n";

  txt += "Whoever chooses the winning hand, wins the round!  If both ";
  txt += "players choose the same hand then the round ends in a tie.\n\n";

  return header + txt;
}

function constructBestFiveRulesText() {
  let header = "Best of Five:\n";

  let txt = "";

  txt += "Player has the option of playing single rounds or playing Best of ";
  txt += "Five games.  In Best of Five, whoever is the first to win 3 rounds, ";
  txt += "wins the game!\n\n";

  return header + txt;
}

function constructWinningHandText() {
  let header = "Winning Hand Combos:\n";

  let txt = "";

  txt += "ROCK: beats SCISSORS and LIZARD; is beaten by PAPER and SPOCK.\n";
  txt += "PAPER: beats ROCK and SPOCK; is beaten by SCISSORS and LIZARD.\n";
  txt += "SCISSORS: beats PAPER and LIZARD; is beaten by ROCK and SPOCK.\n";
  txt += "LIZARD: beats PAPER and SPOCK; is beaten by ROCK and SCISSORS.\n";
  txt += "SPOCK: beats SCISSORS and ROCK; is beaten by PAPER and LIZARD.\n";

  return header + txt;
}