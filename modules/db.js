const SimplDB = require('simpl.db')
const db = new SimplDB({
  collectionsFolder: `${__dirname}/../collections`
})
const usersDefaultFormat = require('./../presets/db/users.json')
const Users = db.createCollection('users')

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

  return {
    users: userMethods(Users)
  }
}


module.exports = operations()
