const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`add`)
        .setDescription(`Me adicione no seu servidor com esse comando`),
    async execute(interaction, client) {

        const add = new EmbedBuilder()
            .setTitle('Me adicione no seu servidor :D')
            .setDescription(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=4398046511103&scope=applications.commands%20bot`)
            .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
            .setColor('#2f3136')
        await interaction.reply({ embeds: [add] });
    },
};