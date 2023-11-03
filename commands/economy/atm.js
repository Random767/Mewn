const { SlashCommandBuilder } = require('discord.js')
const Mewn = require("../../index")
const Users = Mewn.Users

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
        const usersGet = Users.getAll()

        if(usersGet.find(x => x.id === user.id) === undefined){
            return await interaction.reply(`:bank: | **${user.tag}** tem **0 MewnCoins**!`)
        }

        let ranking = usersGet.sort((a, b) => b.coins - a.coins)
        let result = ranking.findIndex(usuario => usuario.id === user.id) + 1

        const atm = Users.get(u => u.id == user.id).coins
        await interaction.reply(`:bank: | **${user.tag}** tem **${atm} MewnCoins** ocupando a **posição #${result}** no _ranking global de MewnCoins_!`)
    }
}
