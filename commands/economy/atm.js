const { SlashCommandBuilder } = require('discord.js')
const SimplDB = require('simpl.db')
const db = new SimplDB()
const Users = db.createCollection('users')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('atm')
        .setDescription('[Economy] Veja quantos MewnCoins um usuário tem')
        .setDMPermission(false)
        .addUserOption(option => 
            option
                .setName('usuário')
                .setDescription('Quer ver a quantidade de MewnCoins de qual usuário?')
        ),
    async execute(interaction){
        const user = interaction.options.getUser('usuário') || interaction.user

        const u = Users.fetchAll()

        if(!Users.has(u => u.id == user.id)){
            //Users.create({"id": user.id, "name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0})
            return await interaction.reply(`:bank: | **${user.tag}** tem **0 MewnCoins**!`)
        }

        const atm = Users.fetch(u => u.id == user.id).coins
        if(user === interaction.user){
            return await interaction.reply(`:bank: | Você tem **${atm} MewnCoins**!`)
        }
        await interaction.reply(`:bank: | **${user.tag}** tem **${atm} MewnCoins**!`)
    }
}