const { SlashCommandBuilder } = require('discord.js')
const SimplDB = require('simpl.db')
const db = new SimplDB({
    collectionsFolder: __dirname + '/../../collections'
})
const Users = db.createCollection('users')
const moment_timezone = require('moment-timezone')
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('[Economy] Receba seus MewnCoins diários')
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.user
        
        if(!Users.has(u => u.id === interaction.user.id)){
            Users.create({"id": user.id, "name": user.username, "discriminator": user.discriminator, "ld": null, "coins": 0, aboutme: null, reps: 0, banned: false})
        }
        
        const convert = moment_timezone(Users.get(u => u.id === interaction.user.id).ld).tz('America/Sao_Paulo');
        const hours = moment_timezone().diff(convert, 'hours');

        if(hours < 12 && hours != null){
            return await interaction.reply(`:clock12: | Você já pegou seu daily, espere **${12 - hours} horas**!`)
        }

        const daily = Math.floor(Math.random() * (2400 - 300 + 1)) + 300
        Users.update(
            person => {
                if(person.id === interaction.user.id){
                    person.coins += daily
                    person.ld = moment().format()
                }
            }
        )
        await interaction.reply(`:moneybag: | Você ganhou **${daily} MewnCoins**, agora você tem ${Users.get(u => u.id === interaction.user.id).coins} MewnCoins!`)
    }
}