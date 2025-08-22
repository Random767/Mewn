const DB = require('./db')
const { nanoid } = require('nanoid')
const Users = DB.Users
const TransactionsDB = DB.Transactions
const transactionsDefaultFormat = require('./../presets/db/transaction.json')
const log = require('./logger')

function ensureUserExists(userId, timestamp) {
    const userExists = TransactionsDB.has(person => person.userId == userId)
    if (!userExists) {
        log.debug(__filename, `Usuário ${userId} não foi encontrado no banco de dados, criando usuário...`)

        let userinfo = JSON.parse(JSON.stringify(transactionsDefaultFormat))
        userinfo.userId = userId
        userinfo.firstRegistry = timestamp

        TransactionsDB.create(userinfo)
        log.debug(__filename, `Usuário criado com sucesso`)
    }
}

function make(type, info) {
    const transaction_id = nanoid(8)
    log.debug(__filename, `Criando uma transação do tipo ${type} com o id ${transaction_id}`)

    let transactionResult = {
        "status": null,
        "id": transaction_id,
        "reason": null
    }

    let sender_id = info.sender_id ?? null
    let userSenderCoins
    let userReciverCoins

    try {

        // Início da transação

        if (info.reciver_id == sender_id) {
            throw new Error(`Tentativa de transferir MewnCoins pra ele mesmo`)
        }

        if (info.amount <= 0) {
            throw new Error(`O valor mínimo de transferência é de 1 MewnCoin`)
        }

        // Checando se usuários existe no db
        if (!Users.has(u => u.id == info.reciver_id)) {
            throw new Error(`O usuário ${info.reciver_id} não existe no banco de dados de usuários`)
        }
        if (!Users.has(u => u.id == info.sender_id) && sender_id != null) {
            throw new Error(`O usuário ${info.sender_id} não existe no banco de dados de usuários`)
        }

        // Salvando informações do usuário para fazer rollback em caso de erro
        userSenderCoins = Users.get(u => u.id == sender_id)?.coins ?? 0
        userReciverCoins = Users.get(u => u.id == info.reciver_id).coins

        // Checando se o sender (se e ele existir) tem coins o suficiente pra transferir
        if (sender_id != null && userSenderCoins - info.amount < 0) {
            throw new Error(`<@${sender_id}> não tem coins o suficiente para concluir a transferência de ${info.amount} MewnCoins`)
        }

        Users.update(person => {
            if (person.id == info.reciver_id) {
                person.coins += info.amount
                log.debug(__filename, `Os ${info.amount} MewnCoins foram adicionados para ${info.reciver_id}`)
            } else if (person.id == sender_id) {
                person.coins -= info.amount
                log.debug(__filename, `Os ${info.amount} MewnCoins foram retirados de ${info.sender_id}`)
            }
        })

        // Checagem de coins
        const userSenderNewCoinsQuantity = Users.get(u => u.id == sender_id)?.coins ?? 0
        const userReciverNewCoinsQuantity = Users.get(u => u.id == info.reciver_id).coins ?? 0
        if (sender_id != null && userSenderCoins - info.amount != userSenderNewCoinsQuantity) {
            throw new Error("Inconsistências na quantidade de coins do Sender")
        } else if (userReciverCoins + info.amount != userReciverNewCoinsQuantity) {
            throw new Error("Inconsistências na quantidade de coins do Reciver")
        }

    } catch (err) {
        log.warning(__filename, `Rollback acionado para a transação ${transaction_id}...`)
        log.warning(__filename, `Motivo: ${err.message}`)
        Users.update(person => {
            if (person.id == info.reciver_id) person.coins = userReciverCoins
            if (person.id == sender_id) person.coins = userSenderCoins
        })
        transactionResult.status = "fail"
        transactionResult.reason = err.message

    } finally {

        log.debug(__filename, `Registrando operação ${transaction_id}`)
        ensureUserExists(info.reciver_id, info.timestamp)
        if(sender_id) ensureUserExists(sender_id, info.timestamp)

        transactionResult.status = transactionResult.status ?? "success"

        TransactionsDB.update(person => {
            if (person.userId != info.reciver_id && person.userId != info.sender_id) return
            if(person[type] == undefined) person[type] = []
            person[type] = [...person[type], {
                "transaction_id": transaction_id,
                "status": transactionResult.status,
                "fail_reason": transactionResult.reason,
                "sender_id": sender_id,
                "reciver_id": info.reciver_id,
                "amount": info.amount,
                "timestamp": info.timestamp
            }]
            person.index = [...person.index, {
                "type": type,
                "transaction_id": transaction_id,
                "timestamp": info.timestamp
            }]
            log.debug(__filename, `Operação ${transaction_id} registrada para ${person.userId} com o status ${transactionResult.status}`)
        })
    }

    return transactionResult
}

/*
NOTAS
Argumentos obrigatórios para o transaction:
make("TIPO DE TRANSACAO", {
    "reciver_id": 0,     // Discord id
    "sender_id": null    // Apenas usado para transações do tipo pay
    "amount": 0,         // Quantidade de coins
    "timestamp": 0 // timestamp gerada com o Date.now() ("number of milliseconds since January 1, 1970")
});

Formato da transação no banco de dados:
USER.daily: [{}]
USER.pay: [{}]
USER.shop: [{}]
USER.(TIPO DE TRANSAÇÃO): [      <- Tome cuidado com erros de ortografia nos tipos de transação
            {
                "transaction_id": transaction_id,
                "sender_id": sender_id,
                "status": transactionResult.status,
                "fail_reason": transactionResult.reason,
                "reciver_id": info.reciver_id,
                "amount": info.amount,
                "timestamp": info.timestamp
            }
        ]

Informações dadas ao final da execução do módulo:
{
    "status": "progress", // null, fail, success
    "id": transaction_id, // ids de 8 dígitos gerados com nanoid
    "reason": null          // Motivo pela transação ter sido cancelada, vazio quando não existe erro 
}


*/

module.exports = {
    make: make
}