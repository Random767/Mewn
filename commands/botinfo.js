const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Veja as informações do bot'),
    async execute(interaction, client){
        const botinfo = new EmbedBuilder()
            .setTitle('Minhas informações')
            .setDescription('Clique [aqui](https://discord.com/oauth2/authorize?client_id=1049428107150512148&scope=bot&permissions=8) para me adicionar')
            .addFields({ name: "Desenvolvedores", value: `${client.users.cache.get('633764019559202836').tag} \nintratec#2443 \npolishnelo#4410`, inline: true})
            .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
            .setColor('#2f3136')
        await interaction.reply({ embeds: [botinfo] })
    },
}