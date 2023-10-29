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
        const userinfo = Users.fetch(u => u.id == interaction.user.id)

        if(!Users.fetch(x => x.id == interaction.user.id)){
            return interaction.reply(`:coin: | Você ainda não tem MewnCoins, mas você pode pegar usando o comando /daily :D`)
        }
        if(interaction.user.id == user.id){
            return interaction.reply(`:octagonal_sign: | Você não pode enviar MewnCoins pra você mesmo :v`)
        }
        const targetinfo = Users.fetch(x => x.id == user.id)
        if(!Users.has(u => u.id == user.id)){
            if(targetinfo){
                await Users.create({"id": user.id, "name": user.username, "discriminator": user.discriminator, "ld": targetinfo.ld, "coins": targetinfo.coins, aboutme: userinfo.aboutme, reps: userinfo.reps, banned: userinfo.banned})
            } else {
                await Users.create({"id": user.id, "name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0, aboutme: null, reps: 0, banned: false})
            }
        }

        // O código verifica duas vezes se o usuário que fez o comando
        // e o que vai receber os MewnCoins existe. 
        // O primeiro faz um fetch no banco de dados para ler
        // diretamente no JSON e procurar pelo usuário, já o segundo
        // verifica se o usuário está em cache, se não tiver, ele cria
        // o usuário de novo, mas com as mesmas configurações que antes,
        // porque, por algum motivo, a bilioteca utilizada (simpl.db)
        // não armazena corretamente as informações em cache, isso foi
        // a origem da boa parte dos bugs relacionados a economia do Mewn.
        // Eu (GRandom) farei uma correção mais elaborada futuramente, quando
        // eu fizer um gerenciamento de cache próprio do Mewn

        if(!Users.has(u => u.id == interaction.user.id)){
            await Users.create({"id": interaction.user.id, "name": interaction.user.username, "discriminator": interaction.user.discriminator, "ld": userinfo.ld, "coins": userinfo.coins, aboutme: userinfo.aboutme, reps: userinfo.reps, banned: userinfo.banned})
        }

        if(quantity > userinfo.coins){
            return await interaction.reply(`:octagonal_sign: | Você não pode fazer uma tranferencia de **${quantity} Mewncoins** tendo **${userinfo.coins} MewnCoins** :v`)
        }

        Users.update(
            person => {
                if(person.id === interaction.user.id){
                    person.coins = userinfo.coins - quantity
                }
                if(person.id === user.id){
                    person.coins = targetinfo.coins + quantity
                }
            }
        )

        await interaction.reply(`:money_with_wings: | **${quantity} MewnCoins** tranferidos para **${user.tag}** com sucesso!`)
    }
}