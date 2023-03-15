const { SlashCommandBuilder, User } = require('discord.js')
const SimplDB = require('simpl.db')
const db = new SimplDB({
    collectionsFolder: __dirname + '/../../collections'
})
const Users = db.createCollection('users')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('[Economy] Transfira MewnCoins pra alguém')
        .setDMPermission(false)
        .addUserOption((option) => 
            option
                .setName('usuário')
                .setDescription('Pra qual usuário você deseja tranferir os MewnCoins?')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('quantidade')
                .setDescription('Quantos MewnCoins você deseja enviar?')
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction){
        const user = interaction.options.getUser('usuário')
        const quantity = interaction.options.getNumber('quantidade')

        if(!Users.has(u => u.id == interaction.user.id)){
            return interaction.reply(':chart_with_downwards_trend: | Você não tem MewnCoins!')
        }
        if(!Users.has(u => u.id == user.id)){
            await Users.create({"id": user.id, "name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0, aboutme: null, reps: 0})
        }

        if(quantity > Users.get(u => u.id = interaction.user.id).coins){
            return await interaction.reply(`:chart_with_downwards_trend: | Você não tem MewnCoins o suficiente!`)
        } else if(interaction.user.id == user.id){
            return interaction.reply(`:octagonal_sign: | Você não pode enviar MewnCoins pra você mesmo :v`)
        }

        Users.update(
            person => {
                if(person.id !== interaction.user.id) return 
                person.coins -= quantity
            }
        
        )
        Users.update(
            person => {
                if(person.id !== user.id) return 
                person.coins += quantity
            }
        )

        await interaction.reply(`:money_with_wings: | **${quantity} MewnCoins** tranferidos para **${user.tag}** com sucesso!`)
    }
}