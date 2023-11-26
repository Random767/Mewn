const fs = require('fs')
const cron = require('node-cron')
const Mewn = require('../index')
const Users = Mewn.Users
const archives = fs.readdirSync(__dirname + '/push')

function scheduleNotifications(){
  try {
    const allUsers = Users.getAll()
    archives.forEach(archive => {
      const push = require(`${__dirname}/push/${archive}`)
      const infos = push.getData(allUsers)
      infos.forEach(user => {
        let channel;
        switch(user.channel.type) {
          case "lastChannel":
            channel = Mewn.client.channels.cache.get(user.channel.id)
            break
          case "dm":
            channel = Mewn.client.users.cache.get(user.channel.id)
            break
        }

        if(channel === undefined) return

        if(user.date === "now"){
          channel.send(user.message)
          push.updateDate(user.id, user.dateId != undefined ? user.dateId : null)
          return
        }
        cron.schedule(user.date, () => {
          channel.send(user.message)
          push.updateDate(user.id, user.dateId != undefined ? user.dateId : null)
        })
      }); 
    
    });
  } catch(err){
    console.error(err)
  }
}

scheduleNotifications()

setInterval(() => {
  scheduleNotifications()
}, 86400000)
