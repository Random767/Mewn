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
        let number = interaction.options.getNumber('quantidade')
        const author_info = Users.fetch(u => u.id == interaction.user.id)
        const target_info = Users.fetch(u => u.id == user.id)

        if (!author_info) {
            return await interaction.reply(`:coin: | Você ainda não tem MewnCoins, mas você pode pegar usando o comando /daily :D`)
        }
        if (interaction.user.id == user.id) {
            return await interaction.reply(':confused: | Você não pode apostar com você mesmo.')
        }
        if (!target_info) {
            return await interaction.reply(`O usuário ${user.username} não tem MewnCoins!`)
        }

        if (number > author_info.coins) return await interaction.reply(`Você não pode apostar mais do que você tem :v`)
        if (number > target_info.coins) return await interaction.reply(`O usuário ${user.username} não tem MewnCoins o suficiente!`)

        await interaction.reply({ content: `<@${user.id}>, <@${interaction.user.id}> quer fazer uma aposta de **${number} MewnCoins** com você.`, ephemeral: false })

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
            if(!Users.has(u => u.id == target_info.id)){
                if(target_info){
                    await Users.create(
                                        {
                                          "id": target_info.id, 
                                          "name": user.username, 
                                          "discriminator": user.discriminator, 
                                          "ld": target_info.ld, 
                                          "notifications": {
                                            "daily": {"date": target_info.notifications.daily.date}}, 
                                          "coins": target_info.coins, 
                                          "aboutme": target_info.aboutme, 
                                          "reps": target_info.reps,
                                          "banned": target_info.banned
                      })
                }
            }
    
            if(!Users.has(u => u.id == interaction.user.id)){
                if(author_info){
                    await Users.create({
                                        "id": interaction.user.id, 
                                        "name": interaction.user.username, 
                                        "discriminator": interaction.user.discriminator, 
                                        "ld": author_info.ld, 
                                        "notifications": {
                                          "daily": {date: author_info.notifications.daily.date}}, 
                                        "coins": author_info.coins, 
                                        "aboutme": author_info.aboutme, 
                                        "reps": author_info.reps, 
                                        "banned": author_info.banned
                                      })
                }
            }

            if (i.user.id !== user.id) {
                return await i.deferUpdate()
            } else if (i.customId == `bet-accept-${message.id}`) {
                await i.deferReply({ ephemeral: false });
                await interaction.editReply({ components: [buttons_disabled] })
                const winner = Math.floor((Math.random() * 2))
                let users = [
                    author_info,
                    target_info
                ]
                const lost = users.filter(x => x.id !== users[winner].id)
                Users.update(
                    async person => {
                        if (person.id == lost[0].id){
                            if(person.coins < number) {
                                number = person.coins
                                person.coins = 0
                                await i.reply({
                                    content: `:x: | <@${users[winner].id}> ganhou apenas **${number} MewnCoins** por que <@${lost[0].id}>, não tinha MewnCoins o suficiente para a transferência.`,
                                    ephemeral: false,
                                })
                                return
                            }
                            person.coins = lost[0].coins - number
                        }
                        if (person.id == users[winner].id) person.coins = users[winner].coins + number
                    }
                )
                await i.editReply({
                    content: `:moneybag: | <@${users[winner].id}> ganhou **${number} MewnCoins** patrocinado por <@${lost[0].id}>`,
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
