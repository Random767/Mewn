const { SlashCommandBuilder } = require('discord.js')
const SimplDB = require('simpl.db')
const db = new SimplDB({
    collectionsFolder: __dirname + '/../../collections'
})
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
        const fetch = Users.fetchAll()

        if(fetch.find(x => x.id === user.id) === undefined){
            //Users.create({"id": user.id, "name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0})
            return await interaction.reply(`:bank: | **${user.tag}** tem **0 MewnCoins**!`)
        }

        let ranking = fetch.sort((a, b) => b.coins - a.coins)
        let result = ranking.findIndex(usuario => usuario.id === user.id) + 1

        const atm = Users.fetch(u => u.id == user.id).coins
        await interaction.reply(`:bank: | **${user.tag}** tem **${atm} MewnCoins** ocupando a **posição #${result}** no _ranking global de MewnCoins_!`)
    }
}