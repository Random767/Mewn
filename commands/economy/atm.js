const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('atm')
        .setDescription('[Economy] Veja quantos MewnCoins um usuário tem')
        .addUserOption(option => 
            option
                .setName('usuário')
                .setDescription('Quer ver a quantidade de MewnCoins de qual usuário?')
        ),
    async execute(interaction){
        const JSONdb = require('simple-json-db')
        const db = new JSONdb('./storage.json')

        const user = interaction.options.getUser('usuário') || interaction.user

        if(!db.has(user.id)){
            db.set(user.id, {"name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0})
        }

        const atm = db.get(user.id)
        if(user === interaction.user){
            return await interaction.reply(`Você tem ${atm.coins} MewnCoins :D`)
        }
        await interaction.reply(`${atm.name} tem ${atm.coins} MewnCoins :D`)
    }
}