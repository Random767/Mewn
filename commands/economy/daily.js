const { SlashCommandBuilder } = require('discord.js')
const Mewn = require("../../index")
const Users = Mewn.Users
const moment_timezone = require('moment-timezone')
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('[Economy] Receba seus MewnCoins diários')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
          .setName("resgatar")
          .setDescription("[Economy] Receba seus MewnCoins diários")
        )
        .addSubcommandGroup((group) => group
          .setName("notificações")
          .setDescription("Não tem descrição")
            .addSubcommand(subcommand => subcommand
              .setName("configurar")
              .setDescription("Configure suas notificações do daily!")
              .addStringOption(option => option.setName("canal")
                .setDescription("Onde você quer que a notificação de pegar o daily venha?")
                .addChoices(
                  {"name": "Na minha DM", "value": "dm"},
                  {"name": "Ultimo canal que peguei o daily", "value": "lastChannel"}
                ).setRequired(false))
              .addStringOption(option => option.setName("ativado")
                .setDescription("Quer ativar ou desativar as notificações?")
                .addChoices(
                  {"name": "Sim", "value": "true"},
                  {"name": "Não", "value": "false"}
                )
              )
            )
        ),
    async execute(interaction) {
      const user = interaction.user
      const userHas = Users.has(u => u.id == user.id)
      let userinfo = Users.get(u => u.id == user.id)

      switch(interaction.options.getSubcommand()){
        case "configurar":
          const channel = interaction.options.getString("canal")
          const active = interaction.options.getString("ativado")
          if(!userHas) {
            return interaction.reply(":octagonal_sign: | Para fazer essa configuração, você precisa **pegar o daily** primeiro utilizando o comando /daily")
          }

          await interaction.deferReply()

          Users.update(person => {
            if(person.id == user.id) {
              if(channel) {
                person.notifications.daily.preference = channel
              }
              if(active) {
                person.notifications.daily.actived = active
              }
            }
          })
          return interaction.editReply(`:white_check_mark: | Sua configuração de notificação foi **salva com sucesso**!`)
        
      case "resgatar":
        if(!Users.has(u => u.id === interaction.user.id)){
          const userJSON =  {"id": user.id, "name": user.username, "discriminator": user.discriminator} 
          Users.create(userJSON)
          userinfo = userJSON
        }
        
        const convert = moment_timezone(Users.get(u => u.id === interaction.user.id).ld).tz('America/Sao_Paulo');
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
}
