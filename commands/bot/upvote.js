const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { client } = require('../../index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upvote')
        .setDescription('[BOT] Vote em mim na top.gg')
        .setDMPermission(false),
    async execute(interaction){
        const voteEmbed = new EmbedBuilder()
            .setTitle('Vote em mim na top.gg :D')
            .setDescription(`Olá ${interaction.user.username}! ao votar em mim você me ajuda a crescer e espalhar fofura em mais servidores :D\nPara votar em mim é simples, basta clicar nesse link: https://top.gg/bot/${client.user.id}/vote`)
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
            .setColor('#4775ec')
        await interaction.reply({ embeds:[voteEmbed] })
    }
}