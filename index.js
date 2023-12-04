const { Client, GatewayIntentBits} = require('discord.js');
require('dotenv').config()
const { AutoPoster } = require('topgg-autoposter')
const fs = require('fs')
const path = require('path')
const { version } = require('./package.json')
const log = require('./modules/logger')

const SimplDB = require('simpl.db')
const db = new SimplDB({
    collectionsFolder: __dirname + '/collections'
})
const Users = db.createCollection('users')

process.title = 'Mewn'
log.debug(__filename, "Mewn está iniciando...")

const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
    presence: {
        activities: [{
            name: `Versão ${version}`,
            type: 2
        }],
    }
})
exports.client = client
exports.Users = Users

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

log.debug(__filename, "Carregando eventos...")
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
  log.debug(__filename, `Carregando o evento ${event.name}`)
	if (event.once) {
		client.once(event.name, (...args) => event.exec(...args));
	} else {
		client.on(event.name, (...args) => event.exec(...args));
	}
}

if(process.env.TOPGG_TOKEN){
    AutoPoster(process.env.TOPGG_TOKEN, client)
}

process.on('uncaughtException', (err, origin) => {
    console.error(err)
    console.error(origin)
    log.error(__filename, `${err}: ${origin}`)
});

process.on('unhandledRejection', (err, origin) => {
    console.error(err)
    console.error(origin)
    log.error(__filename, `${err}: ${origin}`)
});

client.login(process.env.TOKEN)
