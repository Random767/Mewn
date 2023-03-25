const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const SimplDB = require('simpl.db')
const db = new SimplDB({
    collectionsFolder: __dirname + '/../../collections'
})
const Users = db.createCollection('users')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('[Economy] Aposte seus MewnCoins!')
        .setDMPermission(false)
        .addUserOption((user) =>
            user
                .setName('usuário')
                .setDescription('Deseja apostar com qual usuário?')
                .setRequired(true)
        )
        .addNumberOption((nunber) =>
            nunber
                .setName('quantidade')
                .setDescription('Quantos MewnCoins deseja apostar com esse usuário?')
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction, client) {

        const user = interaction.options.getUser('usuário')
        const number = interaction.options.getNumber('quantidade')
        const author_info = Users.fetch(u => u.id === interaction.user.id)

        if (!author_info) {
            return interaction.reply(`:coin: | Você ainda não tem MewnCoins, mas você pode pegar usando o comando /daily :D`)
        }
        const target_info = Users.fetch(u => u.id === user.id)
        if (!target_info) {
            return interaction.reply(`O usuário ${user.username} não tem MewnCoins!`)
        }

        if (interaction.user.id === user.id) {
            return await interaction.reply(':confused: | Você não pode apostar com você mesmo.')
        }

        if (number > author_info.coins) return await interaction.reply(`Você não pode apostar mais do que você tem :v`)
        if (number > target_info.coins) return await interaction.reply(`O usuário ${user.username} não tem MewnCoins o suficiente!`)

        await interaction.reply({ content: `<@${user.id}>, <@${interaction.user.id}> quer fazer uma aposta de ${number} MewnCoins com você.`, ephemeral: false })

        const message = await interaction.fetchReply()

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`bet-accept-${message.id}`)
                    .setLabel('Aceitar')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`bet-refuse-${message.id}`)
                    .setLabel('Recusar')
                    .setStyle(ButtonStyle.Danger),
            )
        const buttons_disabled = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`bet-null_${message.id}`)
                    .setLabel('Aceitar')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`bet-null-${message.id}`)
                    .setLabel('Recusar')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            )


        const filter = i => i.customId === `bet-accept-${message.id}` || `bet-refuse-${message.id}`

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1800000 })

        collector.on('collect', async i => {
            if (i.user.id !== user.id) {
                return await i.reply({
                    content: `:face_with_monocle: | Só <@${user.id}> pode clicar nesse botão!`,
                    ephemeral: true
                })
            } else if (i.customId === `bet-accept-${message.id}`) {
                interaction.editReply({ components: [buttons_disabled] })
                const winner = Math.floor((Math.random() * 2))
                let users = [
                    `${interaction.user.id}`,
                    `${user.id}`
                ]
                const lost = users.filter(x => x !== users[winner])
                await i.reply({
                    content: `:moneybag: | <@${users[winner]}> ganhou ${number} MewnCoins patrocinado por <@${lost[0]}>`,
                    ephemeral: false,
                })
                Users.update(
                    person => {
                        if (person.id === lost[0]) person.coins -= number
                        if (person.id === users[winner]) person.coins += number
                    }
                )
                return
            } else if (i.customId === `bet-refuse-${message.id}`) {
                interaction.editReply({ components: [buttons_disabled] })
                return await i.reply({
                    content: `:octagonal_sign: | <@${interaction.user.id}>, <@${user.id}> recusou sua aposta D:`,
                    ephemeral: false,
                })
            }
        });

        interaction.editReply({ components: [buttons], ephemeral: false })
    }

}