const { SlashCommandBuilder, User } = require('discord.js')
const Transactions = require('./../../modules/transaction')
const DB = require('./../../modules/db')
const Users = DB.Users

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
        const targetUser = interaction.options.getUser('usuário')
        const quantity = interaction.options.getNumber('quantidade')
        const userinfo = Users.get(u => u.id == interaction.user.id)


        if(!Users.get(x => x.id == interaction.user.id)){
            return interaction.reply(`:coin: | Você ainda não tem MewnCoins, mas você pode pegar usando o comando /daily :D`)
        }
        if(interaction.user.id == targetUser.id){
            return interaction.reply(`:octagonal_sign: | Você não pode enviar MewnCoins pra você mesmo :v`)
        }
        if(!Users.has(u => u.id == targetUser.id)){
          await Users.create({"id": targetUser.id, "name": targetUser.username})
          targetinfo = Users.get(x => x.id == targetUser.id)
        }

        if(quantity > userinfo.coins){
            return await interaction.reply(`:octagonal_sign: | Você não pode fazer uma tranferêcia de **${quantity} Mewncoins** tendo **${userinfo.coins} MewnCoins** :v`)
        }

        const dateNow = Date.now()
        const transactionResult = Transactions.make("pay", {
            "sender_id": userinfo.id,
            "reciver_id": targetUser.id,
            "amount": quantity,
            "timestamp": dateNow
        })

        if(transactionResult.status == "fail") {
            return await interaction.reply(`:octagonal_sign: | Erro: ${transactionResult.reason}\n\`\`🔑 ${transactionResult.id}\`\``)
        }

        await interaction.reply(`:money_with_wings: | **${quantity} MewnCoins** transferidos para **${targetUser.tag}** com sucesso! \`\`🔑 ${transactionResult.id}\`\``)
    }
}
