const { Events, EmbedBuilder } = require('discord.js')
const { eventLog } = require('./../config.json')
const moment = require('moment')
moment.locale('pt-BR')
const Discord = require('./../index')
let client = Discord.client

module.exports = {
    name: Events.GuildDelete,
    once: false,
    exec(guild){
        console.log(`[Lost server] O servidor "${guild.name}" removeu o ${client.user.username}, agora tenho ${client.guilds.cache.size} servidores`)

        const log = new EmbedBuilder()
        .setTitle(`Fui removido de um servidor`)
        .addFields({ name: "Nome", value: `${guild.name} (${guild.id})`, inline: false })
        .addFields({ name: "Criado em", value: moment(guild.createdTimestamp).format('LLLL'), inline: false })
        .addFields({ name: "Usuários", value: `${guild.memberCount}`, inline: false })
        .setThumbnail(guild.iconURL({dynamic: true}, {size: 4096}))
        .setColor('#e02c2f')
      
        if(eventLog.isEnabled){
          client.channels.cache.get(eventLog.channels.guildUpdate).send({ embeds: [log] })
        }
      
    }

}