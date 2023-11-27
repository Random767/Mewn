const { Events } = require('discord.js')
const logger = require('./../modules/logger')
const { version } = require('./../package.json')
const { performance } = require('perf_hooks')
const log = require('../modules/logger')

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

        log.debug(__filename, "Carregando módulo de notificações...")
        
        let startTime = performance.now()
        require(__dirname + "/../notifiers/manager")
        let endTime = performance.now()
        let elapsedTime = endTime - startTime
        log.debug(__filename, `Módulo de notificações carregado em ${elapsedTime} ms`)

        log.debug(__filename, "Carregando handler...")
        startTime = performance.now()
        require(`${__dirname}/../handling`)(client)
        endTime = performance.now()
        elapsedTime = endTime - startTime
        log.debug(__filename, `Handler carregado em ${elapsedTime} ms`)
    }
}
