const SimplDB = require("simpl.db")
const db = new SimplDB({
    collectionsFolder: `${__dirname}/../collections`
})
const Users = db.createCollection('users')
const TransactionsDB = db.createCollection('transactions')
const transactionsDefaultFormat = require('./../presets/db/transaction.json')

function log(type, info) {
    console.log(`Criando transação do tipo ${type}...`)
    if(type == "daily") {
        Users.update(person => {
            if(person.id == info.reciver_id) {
                person.coins += info.amount
            }
        })

        const userExist = TransactionsDB.has(person => person.userId == info.reciver_id)
        if(!userExist) {
            let userinfo = JSON.parse(JSON.stringify(transactionsDefaultFormat))
            const dateNow = Date.now()
            userinfo.userId = info.reciver_id
            userinfo.firstRegistry = dateNow         
            TransactionsDB.create(userinfo)
        }

        TransactionsDB.update(person => {
            if(person.userId != info.reciver_id) return
            person.daily = [...person.daily, {"amount": info.amount, "timestamp": info.timestamp}]
            person.index = [...person.index, {"type": "daily", "timestamp": info.timestamp}]
        })

    } else if(type == "pay") {
        // Função não implementada
    }
}



module.exports = {
    log: log
}