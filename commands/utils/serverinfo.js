const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`serverinfo`)
        .setDescription(`[UTILS] Veja as informações de um servidor`)
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName('guild')
                .setDescription('Digite o id de um servidor')
                .setRequired(false)),
    async execute(interaction, client) {
        const { 
                channels, 
                ownerId, 
                region, 
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
            } = client.guilds.cache.get(interaction.options.getString("guild")) || interaction.guild
        const server = client.guilds.cache.get(interaction.options.getString("guild")) || interaction.guild
        const text = channels.cache.filter(x => x.type === 0).size
        const voice = channels.cache.filter(x => x.type === 2).size
        let category = channels.cache.filter(x => x.type === 4).size

        const criador = client.users.cache.get(ownerId)
        const criadoEm = moment(createdAt).format('LLLL')
        const entreiEm = moment(joinedAt).format('LLLL')

        const bots = members.cache.filter(b => b.user.bot).size

        const embed = new EmbedBuilder()
            .setTitle(name)
            .setDescription(description)
            .setColor("#3399ff")
            .setThumbnail(server.iconURL({dynamic: true, size: 4096}))
    
            .addFields({ 
                name: "Geral",
                value: `> Posse: ${criador.tag}\n> Id do servidor: ${id}\n> local de preferência: ${preferredLocale}\n> Boosts: ${premiumSubscriptionCount}\n> Level do boost: ${premiumTier}\n> Panter: ${partnered}`,
                inline: false})
            .addFields({
                name: "Estatísticas usuários",
                value: `> Membros: ${memberCount}\n> Bots: ${bots}\n> Humanos: ${memberCount - bots}`,
                inline: false})
            .addFields({
                name: "Estatísticas canais",
                value: `> Canais de texto: ${text}\n> Canais de voz: ${voice}\n> Categorias: ${category}\n> Canal de regras: ${rulesChannel}\n> Canal AFK: ${afkChannel ?? "Não tem"}`,
                inline: false})
            .addFields({
                name: "Info",
                value: `> Criado em: ${criadoEm}\n> Entrei aqui em: ${entreiEm}`,
                inline: false})
  
            .setImage(server.bannerURL({dinamic: false, size: 4096}))
        await interaction.reply({ embeds: [embed] })
    },
};