const { Events, AttachmentBuilder } = require('discord.js')
const { eventLog } = require('./../config.json')
const logger = require('./../modules/logger')
const Discord = require('./../index')
const { performance } = require('perf_hooks')
const log = require('./../modules/logger')
let client = Discord.client
const errorGif = new AttachmentBuilder('./../assets/internal/error.gif', { name: 'error.gif' })

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
          logs["fields"] = logs["fields"].concat({ name: "Argumentos", value: `\`\`\`${args.join(' ')}\`\`\`` })
        }
        
        if(eventLog.isEnabled){
          client.channels.cache.get(eventLog.channels.commandCreate).send({ embeds: [logs] })
        }
      
        try {
          const startTime = performance.now()
          await command.execute(interaction, client);
          const endTime = performance.now()
          const elapsedTime = endTime - startTime
          log.debug(__filename, `Comando ${interaction.commandName} executado por ${interaction.user.username} levou ${elapsedTime} ms para ser processado e enviado`)
        } catch (error) {
          console.error(error)
          logger.error(__filename, `${error.stack.split('\n')[1].trim()}: ${error}`)
          const err = {
            author: {
              name: `${error}`
            },
            description: `> ${error.stack.split('\n')[1].trim()}`,
            thumbnail: {
              url: 'attachment://error.gif',
            },
            fields: [
              { name: "Comando", value: `\`\`\`${interaction.commandName}\`\`\``}
            ],
            color: 0xe02c2f
          }
          if(args.length >= 1){
            err["fields"] = err["fields"].concat({ name: "Argumentos", value: `\`\`\`${args.join(' ')}\`\`\`` })
          }
          if(eventLog.isEnabled) {
            await interaction.reply({ content: 'Opss. Algo deu errado enquanto eu estava tentando executar esse comando, o problema foi enviado automaticamente para o servidor de suporte.\nhttps://discord.gg/QpvC6B3Enp', ephemeral: true});
            client.channels.cache.get(eventLog.channels.errorCreate).send({ embeds: [err] })
          } else {
            log.error(__dirname, "O log automático de erros para o servidor oficial do Mewn está desativado :/")
            await interaction.reply({ content: 'Opss. Algo deu errado enquanto eu estava tentando executar esse comando, o log de erros está desativado, você pode reportar o erro diretamente no servidor de suporte:\nhttps://discord.gg/QpvC6B3Enp', ephemeral: true });
          }
        }
    }
}
