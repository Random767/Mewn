const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('[Economy] Transfira MewnCoins pra alguém')
        .addUserOption((option) => 
            option
                .setName('usuário')
                .setDescription('Pra qual usuário você dejesa tranferir os MewnCoins?')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('quantidade')
                .setDescription('Quantos MewnCoins você deseja enviae?')
                .setRequired(true)
        ),
    async execute(interaction){
        const JSONdb = require('simple-json-db')
        const db = new JSONdb('./storage.json')

        const user = interaction.options.getUser('usuário')
        const quantity = interaction.options.getNumber('quantidade')

        if(!db.has(user.id)){
            db.set(user.id, {"name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0})
            console.log('Novo usuário criado no banco de dados')
        }
        db.sync()

        if(quantity > db.get(interaction.user.id).coins){
            return await interaction.reply(`Você não tem MewnCoins o suficiente para fazer isso :(`)
        } else if(quantity < 0){
            return interaction.reply(`O Número de MewnCoins não pode ser menos que 0`)
        } else if(interaction.user.id == user.id){
            return interaction.reply(`Você não pode enviar MewnCoins pra você mesmo :v`)
        }

        db.set(interaction.user.id, {"name": interaction.user.username, "discriminator": interaction.user.discriminator, "ld": db.get(interaction.user.id).ld, "coins": db.get(interaction.user.id).coins - quantity})
        db.set(user.id, {"name": user.username, "discriminator": user.discriminator, "ld": db.get(user.id).ld, "coins": db.get(user.id).coins + quantity})
        await interaction.reply(`${quantity} MewnCoins tranferidos para ${user.username} com sucesso!`)
    }
}