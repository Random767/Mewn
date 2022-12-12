const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Veja a quanto tempo o bot está ligado'),
    async execute(interaction, client){
        let dias = 0
        let semanas = 0

        let uptime = ''
        let totalSegundos = (client.uptime / 1000)
        let horas = Math.floor(totalSegundos / 3600)
        totalSegundos %= 3600
        let minutos = Math.floor(totalSegundos / 60)
        let segundos = Math.floor(totalSegundos % 60)

        if(horas > 23){
            dias = dias + 1
            horas = 0
        }
        if(dias == 7){
            dias = 0
            semanas = semanas +1
        }
        if(minutos > 60){
            minutos = 0
        }

        uptime += ` **${semanas} semanas** **${dias}d** **${horas}h** **${minutos}m** **${segundos}s**`
        await interaction.reply(`Fazem exatamente ${uptime} que eu tô acordado, a vontade de mimir ta forte kkkk`)
    }
};