const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('[Utils] Mostra a foto do servidor')
        .setDMPermission(false),
    async execute(interaction){
        const picture = interaction.guild.iconURL({dynamic: true, size: 4096})
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}`)
            .setColor('Aqua')
            .setImage(picture)
        await interaction.reply({ embeds:[embed] })
    }
}