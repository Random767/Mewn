const { SlashCommandBuilder } = require('discord.js')
const data = require('./../../storage.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('[Economy] Veja o ranking de MewnCoins!'),
    async execute(interaction){
        const sortedData = Object.values(data).sort((a, b) => b.coins - a.coins);

        const userCoins = Object.entries(sortedData)
            .map(([id, { name, coins }]) => ({ name: `**${name}**`, value: `${coins} MewnCoins`, inline: true })).slice(0, 10)
        
        let rank = {
            title: 'Rank global de MewnCoins',
            fields: userCoins,
            color: '#2f3136'
        }
        return await interaction.reply({ embeds: [rank] })
    }
}