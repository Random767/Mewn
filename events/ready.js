const { Events } = require('discord.js')
const logger = require('./../modules/logger')
const { version } = require('./../package.json')

module.exports =  {
    name: Events.ClientReady,
    once: false,
    exec(client) {
        logger.info(`${client.user.tag}:${version} iniciado com ${client.guilds.cache.size} servidores`)
  
        let activities = [
          `❓ • Utilize /help para ajuda`,
          `🖥️ • Criado por: ${client.users.cache.get('633764019559202836').tag}`,
          `🐱 • Estou espalhando fofura em ${client.guilds.cache.size} servidores >:3`,
          `👌 • Ajudando ${client.users.cache.size} pessoas :3`,
          `🦆 • Patos são fofos :D`,
          `+  • Me adicione usando o comando /add`
        ]
        i = 0
        setInterval(() => {
          client.user.setActivity(`${activities[i++ % activities.length]}`, {
          type: 0
        }
        )}, 10000);
        client.user.setStatus('online')
      
        require(`${__dirname}/../handling`)(client)
    }
}