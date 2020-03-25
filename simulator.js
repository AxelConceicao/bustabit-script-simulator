var config = {
    wager: {
        value: 10000, type: 'balance', label: 'wager'
    },
    payout: {
        value: 50, type: 'multiplier', label: 'payout'
    }
};

// id:hash:bust
var sample = [
    '20000:d4eb4326ac6375b108b1790c8e0beeda8331650ea7aec95828c7f8cc03d3d44c:4.03',
    '19999:e51c22b79911082f9b4c806a4afcb149624842a534b545818bd8e46a44d42243:4.19',
    '19998:57fb9c4a4f5ccfce361c9afd8ab2bc5122a572faad1c295da0fdcc4b28755695:1.7',
    '19997:c7b4083bf5dcf4bf52a78b290b26eb16c217c4a177461df12f0ef0bc4a98c96e:13.61',
    '19996:242dff76a1bca6823a7f8cc5499077ec15e2a8590b9d286d449e6ca0df8c48d8:6.4',
    '19995:9fc2465dd4d9137714f4350145dfd2814758a1001e3493d762e8f9115255f762:1.62',
    '19994:af250d993822b96ad54ac76fa3069b9758b70c4a5e1c57513a0345f8d4c33b96:6.95',
    '19993:5b46281091f25bd6327dfccb59ecc9d41953438a785e17e314ac221bb722d8d9:431.5',
    '19992:a53705286fbe25d6fc1dbeb13c40c216adb95b7c5311d60347698acbdbd091ee:5.21',
    '19991:e057827e45d786392b30e4550e00e9d8ff1183090c92a99e4616a34b11686193:3.65',
    '19990:fc42ac515fb68519597618d5a068f1fb539614d53d1ec5e32e4e29509d9b2fac:1.04',
]

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function isNumber(n) {
    return Number(n) === n;
}

class Game {
    constructor(id, hash, wager) {
        this.id = id
        this.hash = hash
        this.bust = undefined
        this.cashedAt = undefined
        this.wager = wager
    }
}

class History {
    constructor() {
        this.history = []
    }

    first() {
        return this.history[0]
    }

    last() {
        return this.history[this.history.length - 1]
    }

    toArray() {
        return this.history
    }

    push(game) {
        this.history.unshift(game)
    }
}

class Engine {
    constructor(balance) {
        this.index = 0
        this.balance = balance * 100
        this.startingBalance = this.balance
        this.atl = this.balance
        this.ath = this.balance
        this.gameState = 'GAME_INIT'
        this.gameStateOn = new Object()
        this.currentBet = undefined
        this.currentPayout = undefined
        this.history = new History
    }

    get getState() {
        return this
    }

    get getCurrentBet() {
        return this.currentBet
    }

    isBetQueued() {
        return this.currentBet !== null
    }

    cancelQueuedBet() {
        if (this.gameState === 'GAME_STARTING' && this.currentBet !== null) {
            this.currentBet = undefined
            this.currentPayout = undefined
            this.history.history.splice(0, 1)
        }
    }

    get gameState() {
        return this._gameState
    }

    set gameState(value) {
        // console.log(value)
        this._gameState = value

        try {
            this.gameStateOn[this.gameState]()
        } catch {
            // gameState has no listener
        }
    }

    bet(satoshis, payout) {
        if (this.gameState !== 'GAME_STARTING') {
            console.log('Error: cannot bet now')
            return
        }
        if (!isInt(satoshis)) throw 'bet must be an Integer'
        if (!isNumber(payout)) throw 'payout must be a number'
        if (this.balance - satoshis < 0) {
            throw 'no enough bits'
        } else {
            this.balance -= satoshis
        }

        let temp = sample[this.index].split(':')
        let game = new Game(temp[0], temp[1], satoshis)
        this.history.push(game)
        this.currentBet = satoshis
        this.currentPayout = payout
    }

    on(gameState, listener) {
        this.gameStateOn[gameState] = listener
        // console.log('Listener of ' + gameState + ' set')
    }

    displayLogs() {
        let lastGame = this.history.first()
        if (lastGame.cashedAt) {
            var profit = Math.round(
                (lastGame.wager * lastGame.cashedAt - lastGame.wager) / 100)
            console.log('Won ' + profit + ' bits');
        } else {
            console.log('Lost ' + Math.round(lastGame.wager / 100) + ' bits');
        }
    }
    
    logs() {
        console.log("\n\x1b[1m-----------------------------------")
        console.log(" Game Played : " + this.index)
        console.log(" Starting Balance : " + Math.round(this.startingBalance / 100))
        console.log(" Profit ATL : " + (Math.round(this.atl / 100) - Math.round(this.startingBalance / 100)))
        console.log(" Profit ATH : " + (Math.round(this.ath / 100) - Math.round(this.startingBalance / 100)))
        let profit = Math.round(this.balance / 100) - Math.round(this.startingBalance / 100)
        if (profit > 0) {
            console.log(" Profit : \x1b[32m" + profit + "\x1b[0m")
        } else {
            console.log(" Profit : \x1b[31m" + profit + "\x1b[0m")
        }
        console.log("\x1b[1m Balance : " + Math.round(this.balance / 100))
        console.log("-----------------------------------\n")
    }
    
    gameLoop() {
        this.index = 0
        while (this.index < sample.length) {
            this.gameState = 'GAME_STARTING'
            this.gameState = 'GAME_STARTED'
            this.history.first().bust = sample[this.index].split(':')[2]
            if (this.history.first().bust >= this.currentPayout) { // Won
                this.balance += this.currentBet * this.currentPayout
                this.history.first().cashedAt = this.currentPayout
            }
            this.gameState = 'GAME_ENDED'
            this.currentBet = undefined
            this.currentPayout = undefined
            this.index++ // next bet
            this.atl = Math.min(this.balance, this.atl)
            this.ath = Math.max(this.balance, this.ath)
            console.log('Balance : ' + Math.round(this.balance / 100))
            // displayLogs()
        }
        this.logs()
    }
}

function onGameSTARTING() {
    let bet = 100
    let payout = 2
    engine.bet(bet, payout)
    console.log('Betting ' + Math.round(bet / 100) + ' bits on ' + payout + 'x')
}

function onGameSTARTED() {
    // engine.bet(100, 2) // test
}

function onGameENDED() {
    // script do stuff
}

var engine = new Engine(10000);
// engine.on('GAME_STARTING', onGameSTARTING)
// engine.on('GAME_STARTED', onGameSTARTED)
// Try to bet immediately when script starts

engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);
// engine.on('GAME_ENDED', onGameENDED)

engine.gameLoop()

// console.log(this.history.first())

try {
    process.exit(0)
} catch (err) {
    console.log('Error: ' + err)
    process.exit(1)
}



function onGameStarted() {
    makeBet();
}

function onGameEnded() {
    var lastGame = engine.history.first();

    // If we wagered, it means we played
    if (!lastGame.wager) {
        return;
    }

    if (lastGame.cashedAt) {
        var profit = Math.round((config.wager.value * config.payout.value - config.wager.value) / 100)
        console.log('we won', profit, 'bits');
    } else {
        console.log('we lost', Math.round(config.wager.value / 100), 'bits');
    }
}

function makeBet() {
    engine.bet(config.wager.value, config.payout.value)
    console.log('betting', Math.round(config.wager.value / 100), 'on', config.payout.value, 'x');
}