const { Client, GetawyIntentBits, GatewayIntentBits } = require('discord.js')
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


client.on(`ready`, () => {
    console.log(`Log in ${client.user.tag}`)
})

client.on(`interactionCreate`, async interaction => {
    if(!interaction.isChatInputCommand()) return

    if(interaction.commandName === `ping`){
        await interaction.reply(`Pong!`)
    }
})

client.login(config.token)