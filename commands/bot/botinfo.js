const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('[BOT] Veja minhas informações')
        .setDMPermission(false),
    async execute(interaction, client){
        let ram = Math.round(process.memoryUsage().rss / 1024 / 1024).toFixed(0)
        let cpu = Math.round(process.cpuUsage().system / 1024 / 1024).toString()
        if(cpu < 1){
            cpu = (process.cpuUsage().system / 1024 / 1024).toFixed(2)
        }

        const botinfo = new EmbedBuilder()
            .setTitle('Minhas informações')
            .setDescription(`Clique [aqui](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=132875558974) para me adicionar\nMeu repositório no github: [github.com/Random767/Mewn](https://github.com/Random767/Mewn)`)
            .addFields({ 
                    name: "Desenvolvedores",
                    value: `\`\`\`${client.users.cache.get('633764019559202836').tag}\`\`\``, 
                    inline: false
                })
            
            .addFields({ 
                name: "Linguagem de programação", 
                value: `\`\`\`NodeJs\`\`\``, 
                inline: true
            })
            .addFields({ 
                name: "Host", 
                value: `\`\`\`Raspberry pi\`\`\``, 
                inline: true})
            .addFields({ 
                name: "Ping", 
                value: `\`\`\`${client.ws.ping}ms\`\`\``, 
                inline: true})
            
            .addFields({ 
                name: "Servidores", 
                value: `\`\`\`${client.guilds.cache.size}\`\`\``, 
                inline: true})
            .addFields({ 
                name: "Canais", 
                value: `\`\`\`${client.channels.cache.size}\`\`\``, 
                inline: true 
            })
            .addFields({ 
                name: "Usuários", 
                value: `\`\`\`${client.users.cache.size}\`\`\``, 
                inline: true 
            })
            
            .addFields({ 
                name: "Utilização da ram", 
                value: `\`\`\`${ram}MB\`\`\``, 
                inline: true })
            .addFields({ 
                name: "Uso da CPU", 
                value: `\`\`\`${cpu}%\`\`\``, 
                inline: true })
            
            .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
            .setColor('#2f3136')
            .setTimestamp()
        await interaction.reply({ embeds: [botinfo] })
    },
}