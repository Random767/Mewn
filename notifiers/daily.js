const cron = require("node-cron")
const moment_timezone = require("moment-timezone")
const { EmbedBuilder } = require('discord.js')
const moment = require("moment")
const SimplDB = require("simpl.db")
const db = new SimplDB({
  collectionsFolder: __dirname + "/../collections"
})
const Users = db.createCollection('users')

module.exports = (client) => {
  cron.schedule("* * * * *", () => {
    Users.fetchAll().forEach(user => {
      const convert = moment_timezone(user.ld).tz('America/Sao_Paulo');
      const hours = moment_timezone().diff(convert, 'hours');
      try {
        const usr = client.users.cache.get(user.id)
        if(user.notifications.daily.date){
          return
        }
        if(user.ld != null && hours >= 24){
          const dailyMsg = new EmbedBuilder()
            .setTitle("Pegue seu daily agora")
            .setDescription("As 24 horas já se passaram e você já pode pegar seu daily novamente executando o comando /daily em um servidor a gente está")
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
            .setColor("#40bf40")
          usr.send({ embeds: [dailyMsg] })
          Users.update(
            person => {
              if(person.id == user.id) {
                person.notifications.daily.date = moment().format()
              }
            }
          ) 
        }
      } catch(err) {
        //console.error(err)
      }
    })
  })
}
