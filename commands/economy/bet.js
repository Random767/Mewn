const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const DB = require('./../../modules/db')
const Users = DB.Users
const Transactions = require('./../../modules/transaction')
const transaction = require('./../../modules/transaction')

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
    async execute(interaction) {

        const user = interaction.options.getUser('usuário')
        let coins = interaction.options.getNumber('quantidade')
        const author_info = Users.get(u => u.id == interaction.user.id)
        const target_info = Users.get(u => u.id == user.id)

        if (!author_info) {
            return await interaction.reply(`:coin: | Você ainda não tem MewnCoins, mas você pode pegar usando o comando /daily :D`)
        }
        if (interaction.user.id == user.id) {
            return await interaction.reply(':confused: | Você não pode apostar com você mesmo.')
        }
        if (!target_info) {
            return await interaction.reply(`O usuário ${user.username} não tem MewnCoins!`)
        }

        if (coins > author_info.coins) return await interaction.reply(`Você não pode apostar mais do que você tem :v`)
        if (coins > target_info.coins) return await interaction.reply(`O usuário ${user.username} não tem MewnCoins o suficiente!`)

        await interaction.reply({ content: `<@${user.id}>, <@${interaction.user.id}> quer fazer uma aposta de **${coins} MewnCoins** com você.`, ephemeral: false })

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


        const filter = i => i.customId == `bet-accept-${message.id}` || `bet-refuse-${message.id}`

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 3600000 })

        collector.on('collect', async i => {
            if (i.user.id !== user.id) {
                return
            } else if (i.customId == `bet-accept-${message.id}`) {
                await i.deferReply({ ephemeral: false });
                await interaction.editReply({ components: [buttons_disabled] })
                const winner = Math.floor((Math.random() * 2))
                let users = [
                    author_info,
                    target_info
                ]
                const lost = users.filter(x => x.id !== users[winner].id)[0]

                const transactionResult = transaction.make("bet", {
                    "sender_id": lost.id,
                    "reciver_id": users[winner].id,
                    "amount": coins,
                    "timestamp": Date.now(),
                })

                if(transactionResult.status == "fail") {
                    await i.editReply(`Erro! Transação falhou :/\nMotivo: ${transactionResult.reason}\n \`\`🔑 ${transactionResult.id}\`\``)
                    return
                }


                await i.editReply({
                    content: `:moneybag: | <@${users[winner].id}> ganhou **${coins} MewnCoins** patrocinado por <@${lost.id}>\n \`\`🔑 ${transactionResult.id}\`\``,
                    ephemeral: false,
                })
                return
            } else if (i.customId == `bet-refuse-${message.id}`) {
                await i.deferReply({ ephemeral: false });
                await interaction.editReply({ components: [buttons_disabled] })
                return await i.editReply({
                    content: `:octagonal_sign: | <@${interaction.user.id}>, <@${user.id}> recusou sua aposta D:`,
                    ephemeral: false,
                })
            }
        });

        await interaction.editReply({ components: [buttons], ephemeral: false })
    }

}
