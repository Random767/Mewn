// Módulo responsável por compartilhar a instância
// do banco de dados pelo projeto
// Sem ele, teríamos inconsistências no DB, já
// que cada parte do código teria que inicializar
// sua própria instância, e assim tendo caches 
// independentes, criando problemas no salvamento.
// Basicamente, evitar uma condição de corrida.

const SimplDB = require('simpl.db')
const log = require('./logger')

let DBinstance = null
let Users = null
let Transactions = null

function getDB() {
  if(DBinstance == null) {
    log.debug(__filename, "Criando nova instância do banco de dados")
    DBinstance = new SimplDB({
      collectionsFolder: `${__dirname}/../collections`
    })
    Users = DBinstance.createCollection('users')
    log.debug(__filename, "Collections users criada")
    Transactions = DBinstance.createCollection('transactions')
    log.debug(__filename, "Collections transactions criada")
  }
  return {
    DBinstance: DBinstance,
    Users: Users,
    Transactions
  };
}


module.exports = getDB()