const { SlashCommandBuilder, User } = require('discord.js')
const SimplDB = require('simpl.db')
const db = new SimplDB()
const Users = db.createCollection('users')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDMPermission(false)
        .setDescription('[Economy] Veja o ranking de MewnCoins!'),
    async execute(interaction){
        const userdata = Users.fetchAll()
        let sortedData = userdata.sort((a, b) => b.coins - a.coins);
        
        let userCoins = sortedData.map(({ name, coins }) => ({
            name: `**${name}**`,
            value: `${coins} MewnCoins`,
            inline: true
        })).slice(0, 13)
        
        return await interaction.reply({ embeds: [{
            title: 'Rank global de MewnCoins',
            fields: userCoins,
            color: 0x2f3136
        }] })
    }
}