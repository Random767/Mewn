const cron = require("node-cron")
const moment_timezone = require("moment-timezone")
const { EmbedBuilder } = require('discord.js')
const moment = require("moment")
const Mewn = require("../index")
const Users = Mewn.Users

module.exports = (client) => {
  cron.schedule("* * * * *", () => {
    Users.getAll().forEach(user => {
      const convert = moment_timezone(user.ld).tz('America/Sao_Paulo');
      const hours = moment_timezone().diff(convert, 'hours');
      try {
        if(user.notifications.daily.active == "false") {
          return
        } else if (!user.notifications.daily.channelId){
          return
        } else if(user.notifications.daily.date){
          return
        } else if(user.ld == null) {
          return
        } else if(hours < 24) {
          return
        }

        let channel;
        switch(user.notifications.daily.preference){
          case "dm":
            channel = client.users.cache.get(user.id)
            break
          case "lastChannel":
            channel = client.channels.cache.get(user.notifications.daily.channelId)
            break
        }

        const dailyMsg = new EmbedBuilder()
          .setTitle("Pegue seu daily agora")
          .setDescription("Você já pode pegar seu daily novamente utilizando o comando daily")
          .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
          .setColor("#40bf40")
        channel.send({ content: `<@${user.id}>`, embeds: [dailyMsg] })
        Users.update(
          person => {
            if(person.id == user.id) {
              person.notifications.daily.date = moment().format()
            }
          }
        )
      } catch(err) {
        console.error(err)
      }
    })
  })
}
