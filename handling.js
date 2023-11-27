const { Routes, Collection, REST } = require('discord.js');
const { developerCommands } = require('./config.json')
const fs = require(`fs`);
const logger = require('./modules/logger')
const { performance } = require('perf_hooks')

module.exports = (client) => {
  client.commands = new Collection()
  const commands = [];
  const devCommands = []
  const commandFolder = fs.readdirSync(__dirname + `/commands`)
  
  let commandLoadingTime = 0
  for(const folder of commandFolder){
    const commandFiles = fs.readdirSync(__dirname + `/commands/${folder}`).filter(file => file.endsWith('.js'))

    for (const file of commandFiles){
      const startTime = performance.now();
      const command = require(__dirname + `/commands/${folder}/${file}`);
      if(folder != developerCommands.folder){
        if('data' in command && 'execute' in command){
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command)
        } else {
          logger.warning(__filename, `O comando ${folder}/${file} não tem a propriedade "data" ou "execute" obrigatorias`)
        }
      } else {
        const command = require(__dirname + `/commands/${folder}/${file}`);
        devCommands.push(command.data.toJSON());
        client.commands.set(command.data.name, command)
      }
      const endTime = performance.now()
      const elapsedTime = endTime - startTime
      commandLoadingTime += elapsedTime
      logger.debug(__filename, `Comando ${file} carregado em ${elapsedTime}`)
    }  
  }

  logger.debug(__filename, `Tempo total de carregamento dos comandos: ${commandLoadingTime} ms`)

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  (async () => {
    try {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
      );
      for(let i = 0; i < developerCommands.whitelist.servers.length; i++){
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, developerCommands.whitelist.servers[i]),
          { body: devCommands },
        );
      }
      logger.info(`Comandos carregados com sucesso!`);

    } catch(err){
      logger.error(__filename, `${err.stack.split('\n')[1].trim()}: ${err}`)
    }
  })();
}
