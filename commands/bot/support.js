const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { client } = require('../..')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('[Bot] Entre no meu servidor de suporte')
        .setDMPermission(false),
    async execute(interaction){
        const embed = new EmbedBuilder()
            .setTitle('Meu servidor de suporte')
            .setDescription(`Está precisando de ajuda com o bot ou tem algum bug para reportar? Então entre no meu servidor de suporte clicando [aqui](https://discord.gg/3WYfg5RV9T)`)
            .setThumbnail(client.user.avatarURL())
            .setColor('#2f3136')
            .setTimestamp()
        await interaction.reply({ embeds:[embed] })
    }
}