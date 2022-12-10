const { Client, Collection, Events, GatewayIntentBits, REST, Routes, ApplicationCommand } = require('discord.js')
const config = require(`./config.json`)
const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds
    ],
    presence: {
        activities: [{
            name: "em desenvolvimento",
            type: 3
        }],
        status: 'dnd'
    } 
})
const rest = new REST({ version: '10' }).setToken(config.token);



rest.put(Routes.applicationCommands('1049428107150512148'), { body: [] })
      .then(() => console.log('[Slash] Slash deletados com sucesso'))
      .catch(console.error)

require(`./handling`)(client, rest)

client.on(`ready`, () => {
    console.log(`[Start] Log in ${client.user.tag}`)
})


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Ocorreu um erro enquanto eu estava executando o comando :/', ephemeral: true });
  }
});

client.login(config.token)