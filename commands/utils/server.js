const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`server`)
        .setDescription(`[Utils] Veja as informações de um servidor`)
        .setDMPermission(false)
        .addSubcommandGroup((grup) =>
            grup
                .setName('channel')
                .setDescription('.')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('info')
                        .setDescription('[Utils] Veja as informações de um canal')
                        .addChannelOption((options) =>
                            options
                                .setName('channel')
                                .setDescription('Você quer ver as informações de qual canal?')
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('icon')
                .setDescription('[Utils] Mostra a foto do servidor')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('[Utils] Digite o id de um servidor')
                .addStringOption(options =>
                    options.setName('servidor')
                        .setDescription('Digite o id de um servidor')
                )),
    async execute(interaction, client) {
        await interaction.deferReply()
        if (interaction.options.getSubcommand() == "info" && interaction.options._group !== 'channel') {
            const {
                channels,
                ownerId,
                afkChannel,
                premiumSubscriptionCount,
                premiumTier,
                rulesChannel,
                partnered,
                name,
                description,
                createdAt,
                joinedAt,
                members,
                memberCount,
                id,
                preferredLocale,
            } = client.guilds.cache.get(interaction.options.getString("servidor")) || interaction.guild
            let server = client.guilds.cache.get(interaction.options.getString("servidor")) || interaction.guild
            let text = channels.cache.filter(x => x.type === 0).size
            let voice = channels.cache.filter(x => x.type === 2).size
            let category = channels.cache.filter(x => x.type === 4).size
            let online = members.cache.filter(x => x.presence && x.presence.status === 'online').size
            let idle = members.cache.filter(x => x.presence && x.presence.status  === 'idle').size
            let dnd = members.cache.filter(x => x.presence && x.presence.status  === 'dnd').size
            let offline = members.cache.filter(x => !x.presence ).size

            const criador = client.users.cache.get(ownerId)
            const criadoEm = moment(createdAt).format('LLLL')
            const entreiEm = moment(joinedAt).format('LLLL')

            const bots = members.cache.filter(b => b.user.bot).size

            const embed = new EmbedBuilder()
                .setTitle(name)
                .setDescription(description)
                .setColor("#3399ff")
                .setThumbnail(server.iconURL({ dynamic: true, size: 4096 }))

                .addFields({
                    name: "Geral",
                    value: `> Posse: ${criador.tag}\n> Id do servidor: ${id}\n> local de preferência: ${preferredLocale}\n> Boosts: ${premiumSubscriptionCount}\n> Level do boost: ${premiumTier}\n> Partner: ${partnered}`,
                    inline: false
                })
                .addFields({
                    name: "Estatísticas usuários",
                    value: `> Membros: ${memberCount}\n> Bots: ${bots}\n> Humanos: ${memberCount - bots}\n> Total online: ${online + idle + dnd}`,
                    inline: false
                })
                .addFields({
                    name: "Presenças",
                    value: `> Online: ${online}\n> Ausente: ${idle}\n> Não Perturbe: ${dnd}\n> Offline: ${offline}`,
                    inline: false
                })
                .addFields({
                    name: "Estatísticas canais",
                    value: `> Canais de texto: ${text}\n> Canais de voz: ${voice}\n> Categorias: ${category}\n> Canal de regras: ${rulesChannel}\n> Canal AFK: ${afkChannel ?? "Não tem"}`,
                    inline: false
                })
                .addFields({
                    name: "Info",
                    value: `> Criado em: ${criadoEm}\n> Entrei aqui em: ${entreiEm}`,
                    inline: false
                })

                .setImage(server.bannerURL({ dinamic: false, size: 4096 }))
            await interaction.editReply({ embeds: [embed] })
        } else if (interaction.options.getSubcommand() == 'icon') {
            const picture = interaction.guild.iconURL({ dynamic: true, size: 4096 })
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}`)
                .setColor('Aqua')
                .setImage(picture)
            await interaction.editReply({ embeds: [embed] })
        } else if (interaction.options.getSubcommandGroup() == 'channel') {
            let canal = interaction.options.getChannel('channel') || interaction.channel

            let topico = canal.topic ?? null
            let nsfw = canal.nsfw
            let createdAt = moment(canal.createdAt).format('LLLL')
            let type = canal.type
            let slowmode = canal.rateLimitPerUser

            if (slowmode === '0') {
                slowmode = 'Não tem :/'
            } else if (slowmode !== 'Não tem :/') {
                slowmode = `${slowmode}s`
            }
            if (type === 0 || type === 11 || type === 12) {
                const canalInfo = new EmbedBuilder()
                    .setTitle(canal.name)
                    .setDescription(topico)
                    .addFields({
                        name: "Sobre",
                        value: `> Id: ${canal.id}\n > Tipo: Canal de texto\n> NSFW: ${nsfw}\n> Modo lento: ${slowmode}`
                    })
                    .addFields({
                        name: 'Info',
                        value: `> Criado em: ${moment(canal.createdAt).format('LLLL')}`
                    })
                    .setColor("#2f3136")
                return interaction.editReply({ embeds: [canalInfo] })

            }
            if (type === 2 || type === 13) {
                let userlimit = canal.userLimit
                if (userlimit === '0') userlimit = 'Não definido'

                const voice = new EmbedBuilder()
                    .setTitle(canal.name)
                    .setDescription(topico)
                    .addFields({
                        name: 'Sobre',
                        value: `> Id: ${canal.id}\n > Tipo: Canal de voz\n> Bite Rate: ${canal.bitrate}\n> Limite de usuários: ${userlimit}`
                    })
                    .addFields({
                        name: 'Info',
                        value: `> Criado em: ${createdAt}`
                    })
                    .setColor("#2f3136")
                return interaction.editReply({ embeds: [voice] })

            }
            if (type === 4) {
                const category = new EmbedBuilder()
                    .setTitle(canal.name)
                    .setDescription(topico)
                    .addFields({
                        name: `Sobre`,
                        value: `> Id: ${canal.id}\n > Tipo: Categoria`
                    })
                    .addFields({
                        name: `Info`,
                        value: `> Criado em: ${createdAt}`
                    })
                    .setColor("#2f3136")
                return interaction.editReply({ embeds: [category] })
            } else {
                return interaction.editReply(`Desculpe, o tipo de canal ${type} ainda não foi registrado nos meus códigos`)
            }
        }
    },
};
