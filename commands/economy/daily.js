const { SlashCommandBuilder } = require('discord.js')
const moment = require('moment')
moment.locale('pt-BR')
const moment_timezone = require('moment-timezone')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('[Economy] Receba seus MewnCoins diários')
        .setDMPermission(false),
    async execute(interaction) {
        const JSONdb = require('simple-json-db')
        const db = new JSONdb(`${__dirname}/../../storage.json`)

        if(!db.has(interaction.user.id)){
            db.set(interaction.user.id, {"name": interaction.user.username, "discriminator": interaction.user.discriminator, "ld": null, "coins": 0})
        }
        
        const convert = moment_timezone(db.get(interaction.user.id).ld).tz('America/Sao_Paulo');
        const hours = moment_timezone().diff(convert, 'hours');

        if(hours < 12 && hours != null){
            return await interaction.reply(`Você já pegou seu daily, espere **${12 - hours} horas**`)
        }

        const daily = Math.floor(Math.random() * (5000 - 300 + 1)) + 300
        const coins = db.get(interaction.user.id).coins
        db.set(interaction.user.id, {"name": interaction.user.username, "discriminator": interaction.user.discriminator, "ld": moment().format(), "coins": daily + coins})
        await interaction.reply(`Olá ${interaction.user.username}, você ganhou ${daily} MewnCoins, agora você tem ${db.get(interaction.user.id).coins} MewnCoins!`)
    }
}