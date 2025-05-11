const { SlashCommandBuilder } = require('discord.js')
const Mewn = require("../../index")
const usersDefault = require('./../../presets/db/users.json')
const Users = Mewn.Users
const moment_timezone = require('moment-timezone')
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('[Economy] Receba seus MewnCoins diários')
        .setDMPermission(false),
    async execute(interaction) {
      const user = interaction.user
      const userExist = Users.has(u => u.id == user.id)
      let userinfo = Users.get(u => u.id == user.id)

      if(!userExist){
        const userJSON = {id: user.id, username: user.username}
        Users.create(userJSON)
        userinfo = userJSON
      }
        
      const convert = moment_timezone(userinfo.ld).tz('America/Sao_Paulo');
      const hours = moment_timezone().diff(convert, 'hours');

      if(hours < 24 && hours != null){
        return await interaction.reply(`:clock12: | Você já pegou seu daily, espere **${24 - hours} horas**!`)
      }

      const daily = Math.floor(Math.random() * (2400 - 300 + 1)) + 300
      Users.update(
        person => {
          if(person.id === interaction.user.id){
            person.ld = moment().format()
            person.coins = userinfo.coins + daily
            person.notifications.daily.date = null
            person.notifications.daily.channelId = interaction.channel.id
            if(person.name !== interaction.user.username){
              person.name = interaction.user.username
              person.discriminator = interaction.user.discriminator
            }
          }
        }
      )
      const usersGet = Users.getAll()
      let ranking = usersGet.sort((a, b) => b.coins - a.coins)
      let result = ranking.findIndex(usuario => usuario.id === user.id) + 1

      await interaction.reply(`:moneybag: | Você _ganhou_ **${daily} MewnCoins**, agora você tem *${Users.get(u => u.id === interaction.user.id).coins}* MewnCoins e está em **_${result}° lugar_ no rank global de MewnCoins!**!`)
  }
}
