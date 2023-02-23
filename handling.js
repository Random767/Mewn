const { Routes, Collection, REST } = require('discord.js');
const { developerCommands } = require('./config.json')
const fs = require(`fs`);
const logger = require('./logger')

module.exports = (client) => {
  client.commands = new Collection()
  const commands = [];
  const devCommands = []
  const commandFolder = fs.readdirSync(__dirname + `/commands`)

  for(const folder of commandFolder){
    const commandFiles = fs.readdirSync(__dirname + `/commands/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of commandFiles){
      if(folder != developerCommands.folder){
        const command = require(__dirname + `/commands/${folder}/${file}`);
        if('data' in command && 'execute' in command){
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command)
        } else {
          logger.warning(`O comando ${folder}/${file} não tem a propriedade "data" ou "execute" obrigatorias`)
        }
      } else {
        const command = require(__dirname + `/commands/${folder}/${file}`);
        devCommands.push(command.data.toJSON());
        client.commands.set(command.data.name, command)
      }
    }  
  }
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
      logger.info(`${commands.length + devCommands.length} comandos carregados`);

    } catch(err){
      logger.error(`${error.stack.split('\n')[1].trim()}: ${err}`)
    }
  })();
}
