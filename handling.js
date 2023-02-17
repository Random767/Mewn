const { Routes, Collection, REST } = require('discord.js');
const { developerCommands } = require('./config.json')
const fs = require(`fs`);

module.exports = (client) => {
  client.commands = new Collection()
  const commands = [];
  const devCommands = []
  const commandFolder = fs.readdirSync(__dirname + `/commands`)

  client.guilds.cache.map(x => x.commands.set([]))

  for(const folder of commandFolder){
    const commandFiles = fs.readdirSync(__dirname + `/commands/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of commandFiles){
      if(folder != developerCommands.folder){
        console.log(`Loading ${folder}/${file}`)
        const command = require(__dirname + `/commands/${folder}/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command)
      } else {
        console.log(`Loading dev ${folder}/${file}`)
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
      console.log(`[Load] ${commands.length + devCommands.length} comandos carregados`);

    } catch(err){
      console.error(err);
    }
  })();
}
