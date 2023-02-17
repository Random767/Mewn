const { Client, GatewayIntentBits} = require('discord.js');
require('dotenv').config()
const { AutoPoster } = require('topgg-autoposter')
const fs = require('fs')
const path = require('path')
process.title = 'Mewn'

const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
    presence: {
        activities: [{
            name: "Carregando...",
            type: 3
        }],
        status: 'idle'
    } 
})
exports.client = client

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.exec(...args));
	} else {
		client.on(event.name, (...args) => event.exec(...args));
	}
}

if(process.env.TOPGG_TOKEN){
    AutoPoster(process.env.TOPGG_TOKEN, client)
}

client.login(process.env.TOKEN)
