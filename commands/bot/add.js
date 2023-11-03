const { 
  SlashCommandBuilder, 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`add`)
        .setDescription(`[BOT] Me adicione no seu servidor com esse comando`)
        .setDMPermission(false),
    async execute(interaction, client) {

        const add = new EmbedBuilder()
            .setTitle('Me adicione no seu servidor :D')
            .setDescription(`Sabia que me adicionar no seu servidor me ajuda a crescer? É um simples ato, e só custa alguns cliques, então, clique no botão dessa menssagem para me adicionar :3`)
            .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
            .setColor('#00bfff')
          
        const adicionar = new ButtonBuilder()
          .setLabel("Me adicionar")
          .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=132875558974`)
          .setStyle(ButtonStyle.Link)
        
        const row = new ActionRowBuilder()
          .addComponents(adicionar)


        await interaction.reply({ embeds: [add], components: [row] });
    },
};
