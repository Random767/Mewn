const { Events } = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const Discord = require('./../index')
let client = Discord.client

module.exports = {
    name: Events.MessageCreate,
    once: false,
    exec(message){
        if(message.content.includes(client.user.id) && (!message.author.bot)){
            const response = new EmbedBuilder()
              .setTitle('Central de ajuda')
              .setDescription(`Olá ${message.author.username}! Eu sou o ${client.user.username}, um bot em fase beta, mas futuramente vai vir cheio de functionalidades`)
              .addFields(({ name: '❓ • Entre no meu servidor de suporte', value: 'Clicando aqui: [discord.gg/3WYfg5RV9T](https://discord.gg/3WYfg5RV9T)', inline: true} ))
              .addFields(({ name: '🖥 • Eu sou open source', value: 'Meu repositório no github: [github.com/Random767/Mewn](https://github.com/Random767/Mewn)', inline: true} ))
              
              .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
              .setColor('#2f3136')
        
            message.reply({ embeds: [response] })
          }
    }
}