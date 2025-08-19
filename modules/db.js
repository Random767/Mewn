const DB = require('./dbinit')
const usersDefaultFormat = require('./../presets/db/users.json')
const Users = DB.Users

function operations(){
  function userMethods(data){
    function create(operation){
      let userinfo = JSON.parse(JSON.stringify(usersDefaultFormat))
      userinfo.id = operation.id;
      userinfo.username = operation.username
      const result = data.create(userinfo)
      return result
    }
    function get(operation){
      const result = data.get(operation)
      return result
    }
    function has(operation){
      const result = data.has(operation)
      return result
    }
    function update(operation){
      const result = data.update(operation)
      return result
    }
    function getAll(operation){
      const result = data.getAll(operation)
      return result
    }

    return {
      create: create,
      get: get,
      has: has,
      update: update,
      getAll: getAll
    }
  }

  function transactionMethods() {
    /*
    Todo 19/08/2025: Implementar os métodos da função transactions.
    Implementação da função transactions aqui
    em vez de passsar diretamente para o exports
    é para evitar condição de corrida, onde o objeto
    Transactions tem o valor igual a undefined.
    
    NOTA: Não tenho idéia do porque isso não está funcionando,
    e de qualquer forma, o objeto Transactions continua sendo
    undefined.
    Os planos mudaram, agora todos que quiserem importar o módulo
    transactions teram que referencia ele diretamente, para evitar
    o conhecido "Dependency Cycle". A função transactionMethods
    será retirada daqui em breve.
    Em breve, Users também será movida para outro arquivo.

    O motivo de criação desse módulo é criar uma camada de
    abstração entre o programa e o banco de dados, para que
    uma ocasional troca do banco de dados no futuro seja mais
    fácil. 
    */
    return DB.Transactions
  }

  return {
    Users: userMethods(Users),
    Transactions: transactionMethods() // DEPRECATED
  }
}


module.exports = operations()
