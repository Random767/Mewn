const moment = require('moment')
const moment_timezone = require('moment-timezone')
const log = require('./../../modules/logger')
const DB = require('./../../modules/db')
const Users = DB.Users

function verifyAndUpdateEnergy(userinfo, user){
  if(userinfo.notifications.work.recoveredEnergy.date.length > 0){

    userinfo.notifications.work.recoveredEnergy.date.forEach(energy => {
      for(let i = 0; i < userinfo.energy.data.length; i++) {
        console.log(`energy.id = ${energy.id}  userinfo.energy.data[i].id = ${userinfo.energy.data[i].id}`)
        if(energy.id == userinfo.energy.data[i].id) {
          console.log("Energia válida encontrada")
        } else {
          // deleta registro
        }
      }
      /*
      if(!energy.id == userinfo.energy.id) {
        Users.update(person => {
          if(person.id === user.id){
            log.debug(__filename, `Limpando energias de ${userinfo.name}, que venceram ${energy.date}`)
            person.notifications.work.recoveredEnergy.date = person.notifications.work.recoveredEnergy.date.filter((value) => value.date !== energy.date) 
          }
        })
      }
      */
    })
  }
}

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
            // 17/08/2025 Adicionar remoção de energias que já foram notificadas para o usuário
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
        
          const date = moment(energy.validity).format('m H D M d')

          const message = `:zap: | <@${user.id}> você recuperou **${energy.energy}** pontos de energia :D`
          let userNotificationInfo = {
            "id": user.id,
            "date": minutes >= 0 ? "now" : date,
            "channel": {
              "id": channel,
              "type": user.notifications.work.preference
            },
            "dateId": energy.id,
            "message": {
              content: message,
            }
          }
          log.debug(__filename, `Notificação da energia preparada para ${user.name}`)
          usersArray.push(userNotificationInfo)

        })

        verifyAndUpdateEnergy(user, user)
        
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
