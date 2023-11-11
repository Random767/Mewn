const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('[Bot] Veja a lista dos meus comandos')
        .setDMPermission(false),
    async execute(interaction, client){
        const commands = {
            title: 'Meus comandos',
            fields: [
                {
                    name: "Economia", value:`
                    > atm: Veja quantos MewnCoins um usuário tem.
                    > daily: Receba seus MewnCoins diários.
                    > pay: Transfira MewnCoins pra alguém.
                    > rank: Veja o ranking de MewnCoins.
                    > bet: Aposte seus MewnCoins
                    > work list: Veja a lista de trabalhos disponíveis
                    > work choice: Escolha um trabalho
                    > work start: Começe a trabalhar
                    > work stat: Veja o status do seu trabalho ou de outras pessoas
                    `
                },
                {
                    name: "Roleplay", value: `
                    > 8ball: Faça uma pergunta ao Mewn.
                    > coinflip: Cara ou coroa?
                    `
                },
                {
                    name: "Utilidade", value: `
                    > embed create: Crie uma embed.
                    > server info: Veja informações sobre um servidor.
                    > server icon: Veja a foto do servidor.
                    > server channel info: Veja informações sobre um canal.
                    > user info: Veja informações sobre um usuário.
                    > user avatar: Veja o avatar de um usuário
                    `
                },
                {
                    name: "Bot", value: `
                    > add: Me adicione no seu servidor!
                    > botinfo: Veja minhas informações.
                    > help: Menu de ajuda.
                    > ping: Veja minha latência.
                    > support: Entre no meu servidor de suporte.
                    > uptime: Veja a quanto tempo estou acordado.
                    > upvote: Vote em mim na top.gg!
                    `
                },
            ],
            thumbnail: {
                url: client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" })
            },
            color: 0x2f3136
        }
        interaction.reply({ embeds:[commands] })
    }
}
