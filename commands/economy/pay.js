const { SlashCommandBuilder } = require('discord.js')
const JSONdb = require('simple-json-db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('[Economy] Transfira MewnCoins pra alguém')
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
        const db = new JSONdb(`${__dirname}/../../storage.json`)

        const user = interaction.options.getUser('usuário')
        const quantity = interaction.options.getNumber('quantidade')

        if(!db.has(user.id)){
            db.set(user.id, {"name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0})
        }

        if(quantity > db.get(interaction.user.id).coins){
            return await interaction.reply(`:chart_with_downwards_trend: | Você não tem MewnCoins o suficiente!`)
        } else if(interaction.user.id == user.id){
            return interaction.reply(`:octagonal_sign: | Você não pode enviar MewnCoins pra você mesmo :v`)
        }

        db.set(interaction.user.id, {"name": interaction.user.username, "discriminator": interaction.user.discriminator, "ld": db.get(interaction.user.id).ld, "coins": db.get(interaction.user.id).coins - quantity})
        db.set(user.id, {"name": user.username, "discriminator": user.discriminator, "ld": db.get(user.id).ld, "coins": db.get(user.id).coins + quantity})
        await interaction.reply(`:money_with_wings: | **${quantity} MewnCoins** tranferidos para **${user.tag}** com sucesso!`)
    }
}