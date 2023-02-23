const { Events, EmbedBuilder } = require('discord.js')
const { eventLog } = require('./../config.json')
const Discord = require('./../index')
const logger = require('./../logger')
let client = Discord.client
const moment = require('moment')
moment.locale('pt-BR')

module.exports =  {
    name: Events.GuildCreate,
    once: false,
    exec(guild) {
        logger.info(`[New server] O servidor "${guild.name}" adicionou o ${client.user.username}, agora tenho ${client.guilds.cache.size} servidores`)
        const log = new EmbedBuilder()
          .setTitle(`Novo servidor :D`)
          .addFields({ name: "Nome", value: `${guild.name} (${guild.id})`, inline: false })
          .addFields({ name: "Criado em", value: moment(guild.createdTimestamp).format('LLLL'), inline: false })
          .addFields({ name: "Usuários", value: `${guild.memberCount}`, inline: false })
          .setThumbnail(guild.iconURL({dynamic: true}, {size: 4096}))
          .setColor('#4775ec')
      
        if(eventLog.isEnabled){
          client.channels.cache.get(eventLog.channels.guildUpdate).send({ embeds: [log] })
        }
    }
}