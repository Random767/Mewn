const { SlashCommandBuilder } = require('discord.js')
const Mewn = require('../../index')
const Users = Mewn.Users

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notifications")
    .setDescription("[Utils] Configure as notificações que quer receber")
    .addSubcommand(subcommand => subcommand.setName("daily")
      .setDescription("[Utils] Configure as notificações do daily")
      .addStringOption(option => option.setName("canal")
        .setDescription("Onde você quer que a notificação de pegar o daily venha?")
          .addChoices(
            {"name": "Na minha DM", "value": "dm"},
            {"name": "Ultimo canal que peguei o daily", "value": "lastChannel"}
          ).setRequired(false))
      .addStringOption(option => option.setName("ativado")
        .setDescription("Quer receber as notificações para pegar o daily?")
          .addChoices(
            {"name": "Sim", "value": "true"},
            {"name": "Não", "value": "false"}
          ))),
  async execute(interaction){
    const user = interaction.user
    const userinfo = Users.get(u => u.id == user.id)

    switch(interaction.options.getSubcommand()){
      case "daily":
        const channel = interaction.options.getString("canal")
        const active = interaction.options.getString("ativado")
        if(!userinfo) {
          return interaction.reply(":octagonal_sign: | Para fazer essa configuração, você precisa **pegar o daily** primeiro utilizando o comando /daily")
        } else if(!channel && !active){
          return await interaction.reply(":octagonal_sign: | Nenhuma configuração para alterar :/")
        } else if(userinfo.notifications.daily.actived == "false" && !active && channel){
          return await interaction.reply(":octagonal_sign: | As suas notificações do daily estão desativadas, para alterar o canal, você precisa ativar suas notificações do daily :/")
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

        if(active == "false"){
          return await interaction.editReply(":no_bell: | Não irei mais te notificar de que você pode pegar o daily")
        } else if(channel == "lastChannel") {
          return interaction.editReply(":bell: | Irei notificar você para pegar o daily novamente no ultimo canal que você pegou o daily :D")
        } else if(channel == "dm"){ 
          return interaction.editReply(`:bell: | Irei **notificar você para pegar o daily novamente na sua DM**. Certifique-se de que ela esteja abeta, caso esteja fechada, irei reverter sua configuração de notificação e irei te notificar do daily no ultimo canal que você o pegou ;3`)
        }
      return interaction.editReply(":bell: | Irei notificar quando você puder pegar o daily novamente :D")
    }
  }
}
