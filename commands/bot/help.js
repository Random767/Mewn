const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Utilize esse comando para ajuda')
        .setDMPermission(false),
    async execute(interaction, client){
        const response = new EmbedBuilder()
            .setTitle('Central de ajuda')
            .setDescription(`Olá ${interaction.user.username}! Eu sou o ${client.user.username}, um bot em fase beta, mas futuramente vai vir cheio de functionalidades`)
            .addFields(({ name: '❓ • Entre no meu servidor de suporte', value: 'Clicando aqui: [discord.gg/3WYfg5RV9T](https://discord.gg/3WYfg5RV9T)', inline: true} ))
            .addFields(({ name: '🖥 • Eu sou open source', value: 'Meu repositório no github: [github.com/Random767/Mewn](https://github.com/Random767/Mewn)', inline: true} ))
            .addFields({ name: "🤔 • Quer ver todos os meus comandos?", value: "Utilize o comando /commands", inline: false })
        
            .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
            .setColor('#2f3136')
        await interaction.reply({ embeds: [response] })
    }
}