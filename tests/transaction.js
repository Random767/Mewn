const transaction = require('./../modules/transaction')
const daily = require('../commands/economy/daily')
const pay = require('./../commands/economy/pay')
const atm = require('./../commands/economy/atm')

// template de como deve funcionar o módulo de transação
const dateNow = Date.now()
//transaction.make("daily", {"reciver_id": 633764019559202836, "amount": 8502, "timestamp": dateNow, "messaage": ""});
//transaction.make("pay", {"sender_id" : 4, "reciver_id": 0, "amount": 0, "timesamp": 0, "messaage": ""})

// Testes de transações para os comandos de economia
// Interaction é o template simulando um usuário
// fazendo comandos


const anotherUser = {
    "id": "2",
    "tag": "cobaia.2",
    "username": "Cobaia2"
}

const Interaction = {
    "user": {
        "id": "1",
        "tag": "cobaia.",
        "username": "Cobaia"
    },
    "channel": {
        "id": 0
    },
    "options": {
        "getUser": (tmp) => anotherUser,
        "getNumber": (tmp) => 50
    },
    reply: (message) => {
        console.log(message)
    }
}


// Saídas devem ser checadas no terminal
daily.execute(Interaction)
atm.execute(Interaction)
pay.execute(Interaction)
