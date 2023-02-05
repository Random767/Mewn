const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Veja a quanto tempo o bot está ligado'),
    async execute(interaction, client){

        let uptime = ''
        let totalSegundos = (client.uptime / 1000)
        let dias = Math.floor(totalSegundos / 86400);
        totalSegundos %= 86400;
        let horas = Math.floor(totalSegundos / 3600)
        totalSegundos %= 3600
        let minutos = Math.floor(totalSegundos / 60)
        let segundos = Math.floor(totalSegundos % 60)

        uptime += ` **${dias}d** **${horas}h** **${minutos}m** **${segundos}s**`
        exports.uptime = uptime
        await interaction.reply(`Fazem exatamente ${uptime} que eu tô acordado, a vontade de mimir ta forte kkkk`)
    }
};
