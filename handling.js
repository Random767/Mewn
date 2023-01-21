const { REST, Routes, Collection } = require('discord.js');
const fs = require(`fs`)
const config = require('./config.json')

module.exports = (client, rest) => {
    client.commands = new Collection()
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
  }

  (async () => {
    try {
      rest.put(Routes.applicationCommands(config.id), { body: [] })
      .catch(console.error)

      let data;
      const servers = client.guilds.cache.map(x => x.id)
    for(let i=0; i<servers.length; i++){
      data = await rest.put(Routes.applicationGuildCommands(config.id, `${servers[i]}`),
        { body: commands }
      )
    }

      console.log(`[Load] ${data.length} comandos carregados `)

    } catch(err){
      console.error(err);
    }
  })();
}
