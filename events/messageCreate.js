const { Events } = require('discord.js')
const Discord = require('./../index')
let client = Discord.client

module.exports = {
    name: Events.MessageCreate,
    once: false,
    exec(message){
        if(message.content.includes(`<@${client.user.id}>`) && (!message.author.bot)){
            message.reply(`Olá ${message.author.username}! Meu nome é ${client.user.username}, utilize /help para mais informações`)
          }
    }
}