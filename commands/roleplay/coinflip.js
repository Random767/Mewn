const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('[RP] Cara ou coroa?')
        .setDMPermission(false),
    async execute(interaction){
        const coinflip = [
            'cara',
            'coroa'
        ]
        const result = Math.floor((Math.random() * coinflip.length))
        await interaction.reply(`:coin: | Eu girei a moeda e caiu **${coinflip[result]}**!`)
    }
}
