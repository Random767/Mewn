const { Events, EmbedBuilder } = require('discord.js')
const { eventLog } = require('./../config.json')
const logger = require('./../modules/logger')
const Discord = require('./../index')
let client = Discord.client

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async exec(interaction){
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) {
          console.error(`Nenhum comando com o nome ${interaction.commandName} foi encontrado`);
          return;
        }
        const options = interaction.options._hoistedOptions
        const args = options.map(({ name, value }) => {
          return `${name}: ${value}`
        })
        let logs = {
          title: "Alguém executou um comando",
          fields: [
            { name: "Autor", value: "```" + interaction.user.tag + " (" + interaction.user.id + ") ```", inline: false},
            { name: "Servidor", value: "```" + interaction.guild.name + " (" + interaction.guild.id + ")```", inline: false},
            { name: "Comando", value: "```" + interaction.commandName + "```", inline: false},
          ],
          thumbnail: {
            url: interaction.user.displayAvatarURL({dynamic: true})
          },
          color: 0x2f3136
        }
        if(args.length >= 1){
          logs["fields"] = logs["fields"].concat({ name: "Argumentos", value: `\`\`\`${args.join(', ')}\`\`\`` })
        }
        
        if(eventLog.isEnabled){
          client.channels.cache.get(eventLog.channels.commandCreate).send({ embeds: [logs] })
        }
      
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(error)
          logger.error(`${error.stack.split('\n')[1].trim()}: ${error}`)
          const err = new EmbedBuilder()
            .setTitle('Ocorreu um erro enquanto eu estava executando um comando :/')
            .setDescription(`Error ${error.stack.split('\n')[1].trim()}: ${error}`)
            .addFields({ name: "Comando", value: `\`\`\`${interaction.commandName}\`\`\``})
            .addFields({ name: "Argumentos", value: `\`\`\`${options[0]?.value ?? 'Nenhum argumento foi utilizado'}\`\`\`` })
            .setThumbnail('https://2.bp.blogspot.com/-CPO_z4zNSnc/WsY667p0JgI/AAAAAAAAYRs/ubTMJD5ToyImbR-o4EiK18gBypYXd0RiwCLcBGAs/s1600/Mercenary%2BGarage%2BError%2BGIF.gif')
            .setColor('#e02c2f')
          client.channels.cache.get(eventLog.channels.errorCreate).send({ embeds: [err] })
          await interaction.reply({ content: 'Ocorreu um erro enquanto eu estava executando o comando :/', ephemeral: true });
        }
    }
}