const { Events } = require('discord.js')
const { info } = require('./../config.json')

module.exports =  {
    name: Events.ClientReady,
    once: false,
    exec(client) {
        console.log(`[Start] ${client.user.tag} foi iniciado com ${client.guilds.cache.size} servidores`)
  
        let activities = [
          `❓ • Ultilize /help para ajuda`,
          `🖥️ • Criado por: ${client.users.cache.get(info.devId[0]).tag}`,
          `🐱 • Estou espalhando fofura em ${client.guilds.cache.size} servidores >:3`,
          `👌 • Ajudando ${client.users.cache.size} pessoas :3`,
          `🦆 • Patos são fofos :D`,
          `+  • Me adicione usando o comando /add`
        ]
        i = 0
        setInterval(() => {
          client.user.setActivity(`${activities[i++ % activities.length]}`, {
          type: 1
        }
        )}, 10000);
        client.user.setStatus('online')
      
        require(`${__dirname}/../handling`)(client)
    }
}