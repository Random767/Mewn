const { Events } = require('discord.js')

module.exports =  {
    name: Events.ClientReady,
    once: false,
    exec(client) {
        console.log(`[Start] ${client.user.tag} foi iniciado com ${client.guilds.cache.size} servidores`)
  
        let activities = [
          `❓ • Utilize /help para ajuda`,
          `🤔 • Utilize /commands para ver meus comandos`,
          `🖥️ • Criado por: ${client.users.cache.get('633764019559202836').tag}`,
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