// Config

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
    constructor(balance, games) {
        this.games = games
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

        let temp = this.games[this.index].split(':')
        let game = new Game(temp[0], temp[1], satoshis)
        this.history.push(game)
        this.currentBet = satoshis
        this.currentPayout = payout
    }

    on(gameState, listener) {
        this.gameStateOn[gameState] = listener
        console.log('Listener of ' + gameState + ' set')
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
        while (this.index < this.games.length) {
            this.gameState = 'GAME_STARTING'
            this.gameState = 'GAME_STARTED'
            this.history.first().bust = this.games[this.index].split(':')[2]
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
            // console.log('Balance : ' + Math.round(this.balance / 100))
        }
        this.logs()
    }
}

function loadFile(filename) {
    var fs = require('fs');
    fs.readFile(filename, 'utf8', function (err, contents) {
        games = contents.split('\n')
        var engine = new Engine(1000000, games.reverse());

        // Script

        engine.gameLoop()
    });
}

if (process.argv[2] === undefined) {
    console.log('USAGE: ./simulator file')
    process.exit(1)
} else {
    loadFile(process.argv[2])
}