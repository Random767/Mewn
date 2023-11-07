const { Events } = require('discord.js')
const logger = require('./../modules/logger')
const { version } = require('./../package.json')

module.exports =  {
    name: Events.ClientReady,
    once: false,
    exec(client) {
        logger.info(`${client.user.tag} v${version} iniciado com ${client.guilds.cache.size} servidores`)
  
        let activities = [
          `❓ • /help para ajuda`,
          `⌨️ • /commands para ver meus comandos`,
          `🐱 • Estou espalhando fofura em ${client.guilds.cache.size} servidores >:3`,
        ]
        i = 0
        setInterval(() => {
          client.user.setActivity(`${activities[i++ % activities.length]}`, {
          type: 0
        }
        )}, 30000);
        client.user.setStatus('idle')

        require("./../notifiers/daily.js")(client) 
        require(`${__dirname}/../handling`)(client)
    }
}
