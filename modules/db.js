const SimplDB = require('simpl.db')
const db = new SimplDB({
  collectionsFolder: `${__dirname}/../collections`
})
const usersDefaultFormat = require('./../presets/db/users.json')
const Users = db.createCollection('users', usersDefaultFormat)

function operations(){
  function methods(data){
    function create(operation){
      const result = data.create(operation)
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

  function users(){
    return methods(Users)
  }
  return {
    users: users()
  }
}


module.exports = operations()
