const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('[RP] Cara ou coroa?')
        .setDMPermission(false),
    async execute(interaction){
        if(interaction.options.getSubcommand() == 'bet'){
            return await interaction.reply('Em breve')
        } else if(interaction.options.getSubcommand() == 'flip') {
            const coinflip = [
                'Cara',
                'Coroa'
            ]
            const result = Math.floor((Math.random() * coinflip.length))
            await interaction.reply(`:coin: | ${coinflip[result]}!`)
        }
    }
}