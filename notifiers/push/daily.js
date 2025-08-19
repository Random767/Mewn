const moment = require('moment')
const { EmbedBuilder } = require('discord.js')
const moment_timezone = require('moment-timezone')
const log = require('../../modules/logger')
const DB = require('./../../modules/db')
const Users = DB.Users

const daily = {
  getData: (users) => {
    let usersArray = []
    users.forEach(user => {
      try {
        if(user.notifications.daily.active == "false") {
          return
        } else if(user.notifications.daily.date !== null){
          return
        } else if (!user.notifications.daily.channelId){
          return
        } else if(user.ld == null) {
          return
        }
        
        const convert = moment_timezone(user.ld).tz('America/Sao_Paulo');
        const minutes = moment_timezone().diff(convert, 'minutes');

        let channel;
        switch(user.notifications.daily.preference){
          case "dm":
            channel = user.id
            break
          case "lastChannel":
            channel = user.notifications.daily.channelId
            break
        }

        const dailyMsg = new EmbedBuilder()
          .setTitle("Seu daily já está disponível :D")
          .setDescription("Pegue seu daily utilizando o comando /daily")
          .setThumbnail(Mewn.client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
          .setColor("#40bf40")
        
        const date = moment(user.ld)
        const in24Hours = date.add(24, 'hours').format('m H D M d')

        let userNotificationInfo = {
          "id": user.id,
          "date": minutes > 1440 ? "now" : in24Hours,
          "channel": {
            "id": channel,
            "type": user.notifications.daily.preference
          },
          "message": {
            content: `<@${user.id}>`,
            embeds: [dailyMsg]
          }
        }
        log.debug(__filename, `Notificação do daily preparada para ${user.name}`)
        usersArray.push(userNotificationInfo)
        
      } catch(err) {
        console.error(err)
      }
    })
  return usersArray
  },
  updateDate: (userId) => {
    Users.update(person => {
      if(person.id === userId){
        person.notifications.daily.date = moment().format()
      }
    })
  }
}

module.exports = daily
