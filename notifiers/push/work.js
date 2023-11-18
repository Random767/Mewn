const moment = require('moment')
const { EmbedBuilder } = require('discord.js')
const moment_timezone = require('moment-timezone')
const Mewn = require('../../index')
const Users = Mewn.Users

const work = {
  getData: (users) => {
    let usersArray = []
    users.forEach(user => {
      try {
        if(!user.notifications.work.recoveredEnergy.actived){
          return
        } else if(user.energy.data.length === 0) {
          return
        } else if (!user.notifications.work.channelId){
          return
        }

        user.energy.data.forEach(energy => {
          if(user.notifications.work.recoveredEnergy.date.some(obj => {
            return obj.id === energy.id
          })){
            return 
          }
          const convert = moment_timezone(energy.validity).tz('America/Sao_Paulo');
          const minutes = moment_timezone().diff(convert, 'minutes'); 

          let channel;
          switch(user.notifications.work.preference){
            case "dm":
              channel = user.id
              break
            case "lastChannel":
              channel = user.notifications.work.channelId
              break
          }

          const workMsg = new EmbedBuilder()
            .setTitle(`Você recuperou **${energy.energy} pontos de energia** :D`)
            .setDescription("Você pode usa-las com o comando work start")
            .setThumbnail("http://icons.iconarchive.com/icons/google/noto-emoji-travel-places/1024/42689-high-voltage-icon.png")
            .setColor("#40bf40")
        
          const date = moment(energy.validity).format('m H D M d')

          let userNotificationInfo = {
            "id": user.id,
            "date": minutes >= 0 ? "now" : date,
            "channel": {
              "id": channel,
              "type": user.notifications.work.preference
            },
            "dateId": energy.id,
            "message": {
              content: `<@${user.id}>`,
              embeds: [workMsg]
            }
          } 
          usersArray.push(userNotificationInfo)

        })
        
      } catch(err) {
        console.error(err)
      }
    })
    return usersArray
  },
  updateDate: (userId, energyId) => {
    Users.update(person => {
      if(person.id === userId){
        person.notifications.work.recoveredEnergy.date = [
          ...person.notifications.work.recoveredEnergy.date,
          {
            id: energyId,
            date: moment().format()
          }
        ]
      }
    })
  }
}

module.exports = work
