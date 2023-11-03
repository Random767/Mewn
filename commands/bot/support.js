const { 
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle, 
} = require('discord.js')
const { client } = require('../..')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('[Bot] Entre no meu servidor de suporte')
        .setDMPermission(false),
    async execute(interaction){
        const embed = new EmbedBuilder()
            .setTitle('Meu servidor de suporte')
            .setDescription(`Está precisando de **ajuda com o bot**? Tem algum **bug para reportar**? Quer **conhecer novas pessoas**? Ou tem alguma **sugestão para o Mewn**? Você pode ver isso e mais um pouco no meu **servidor de suporte** :D`)
            .setThumbnail(client.user.avatarURL())
            .setColor('#00bfff')
            .setTimestamp()
    
        const support = new ButtonBuilder()
          .setLabel("Servidor de suporte")
          .setURL("https://discord.gg/3WYfg5RV9T")
          .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder()
          .addComponents(support)

        await interaction.reply({ embeds:[embed], components: [row] })
    }
}
