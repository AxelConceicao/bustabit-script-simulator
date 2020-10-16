var config = {
  wager: {
    value: 100,
    type: 'balance',
    label: 'Base bet',
  },
  payout: {
    value: 2,
    type: 'multiplier',
    label: 'Coeff to wait for',
  },
};

let netProfit = 0;
let baseList = [];
let currentGamesPlayed = 0;
let currentlyPlaying = true;

initScript();

function getCurrentBetLightGuide() {
  let currentMultiplier = 0;
  let currentBet = null;
  if (netProfit >= 0 && currentGamesPlayed > 0) {
    return currentBet;
  }
  if (baseList.length >= 2) {
    currentMultiplier = baseList[0] + baseList[baseList.length - 1];
    currentBet = currentMultiplier * config.wager.value;
  } else if (baseList.length === 1) {
    currentMultiplier = baseList[0];
    currentBet = currentMultiplier * config.wager.value * 2;
  } else {
    currentMultiplier = null;
  }
  return currentBet;
}

function initScript() {
  baseList = [1, 2, 3];
  netProfit = 0;
  currentGamesPlayed = 0;
  currentlyPlaying = true;
}

// Try to bet immediately when script starts
if (engine.gameState === 'GAME_STARTING') {
  makeBet();
}

engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);

function onGameStarted() {
  if (!currentlyPlaying) {
    initScript();
  }
  let currentBet = getCurrentBetLightGuide();

  if (!currentBet) {
    currentlyPlaying = false;
    initScript();
  }
  makeBet();
}

function onGameEnded() {
  let lastGame = engine.history.first();
  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }
  let lastBet = getCurrentBetLightGuide();

  if (lastGame.cashedAt) {
    let profit = Math.round((lastBet * config.payout.value - lastBet) / 100);
    netProfit += profit;
    log('Won', Math.round(profit), 'bits');
    if (baseList.length > 1) {
      baseList.splice(baseList.length - 1, 1);
    }
    baseList.splice(0, 1);
  } else {
    var lost = lastBet / 100;
    log('Lost', Math.round(lost), 'bits');
    netProfit -= lost;
    baseList.push(lastBet / config.wager.value);
  }
  currentGamesPlayed += 1;
}

function makeBet() {
  let currentBet = getCurrentBetLightGuide();
  log('Betting', Math.round(currentBet / 100), 'bits');
  engine.bet(Math.round(currentBet / 100) * 100, config.payout.value);
}
