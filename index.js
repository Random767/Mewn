const { Client, Collection, GatewayIntentBits } = require('discord.js')
const config = require(`./config.json`)
const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds
    ],
    presence: {
        activities: [{
            name: "Em desenvolvimento",
            type: 1
        }],
        status: 'idle'
    } 
})
const hand = require(`./handling`)(client, Collection, GatewayIntentBits)

client.on(`ready`, () => {
    console.log(`Log in ${client.user.tag}`)
})

client.on(`interactionCreate`, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = interaction.client.commands.get(interaction.commandName);
  
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });

client.login(config.token)