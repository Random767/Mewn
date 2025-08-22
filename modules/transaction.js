const DB = require('./db')
const Users = DB.Users
const TransactionsDB = DB.Transactions
const transactionsDefaultFormat = require('./../presets/db/transaction.json')
const log = require('./logger')

function make(type, info) {
    log.debug(__filename, `Criando uma transação do tipo ${type} para ${info.reciver_id}`)

    Users.update(person => {
        if (person.id == info.reciver_id) {
            person.coins += info.amount
            log.debug(__filename, `Os ${info.amount} MewnCoins foram adicionados para ${info.reciver_id}`)
        } else if(person.id == info.sender_id) {
            person.coins -= info.amount
            log.debug(__filename, `Os ${info.amount} MewnCoins foram retirados de ${info.sender_id}`)
        }
    })

    
    log.debug(__filename, `Registrando operação com o timestamp de ${info.timestamp}...`)
    const userExist = TransactionsDB.has(person => person.userId == info.reciver_id)
    if (!userExist) {
        log.debug(__filename, `Usuário ${info.reciver_id} não foi encontrado no banco de dados, iniciando criação...`)
        let userinfo = JSON.parse(JSON.stringify(transactionsDefaultFormat))
        const dateNow = info.timestamp
        userinfo.userId = info.reciver_id
        userinfo.firstRegistry = dateNow
        TransactionsDB.create(userinfo)
        log.debug(__filename, `Usuário criado com sucesso`)
    }


    TransactionsDB.update(person => {
        if (person.userId != info.reciver_id) return
        person[type] = [...person[type], { "amount": info.amount, "timestamp": info.timestamp }]
        person.index = [...person.index, { "type": type, "timestamp": info.timestamp }]
        log.debug(__filename, `Operação ${info.timestamp} de ${info.reciver_id} registrada com sucesso`)
    })


}



module.exports = {
    make: make
}