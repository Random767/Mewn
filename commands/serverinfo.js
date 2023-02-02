const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`serverinfo`)
        .setDescription(`Veja as informações de um servidor`)
        .addStringOption(option => 
            option.setName('guild')
                .setDescription('Digite o id de um servidor')
                .setRequired(false)),
    async execute(interaction, client) {
        let servidor = client.guilds.cache.get(interaction.options.getString("guild")) || interaction.guild
        console.log(servidor)
        let servBanner = interaction.guild.bannerURL({ dynamic: false, size: 4096})
        let text = servidor.channels.cache.filter(x => x.type === 'text').size
        let voice = servidor.channels.cache.filter(x => x.type === 'voice').size
        let category = servidor.channels.cache.filter(x => x.type === 'category').size
        let online = servidor.members.cache.filter(x => x.presence === 'online').size
        let idle = servidor.members.cache.filter(x => x.presence === 'idle').size
        let dnd = servidor.members.cache.filter(x => x.presence === 'dnd').size
        let offline = servidor.members.cache.filter(x => x.presence === 'offline').size
        let total = online + idle + dnd
  
        let criador = client.users.cache.get(servidor.ownerId)
        let criadoEm = moment(interaction.guild.createdAt).format('LLLL')
        let entreiEm = moment(interaction.guild.joinedAt).format('LLLL')
        let regiao = servidor.region
        let afkChannel = servidor.afkChannel
        let nivelVeri = servidor.verificationLevel
        let totalBoosts = servidor.premiumSubscriptionCount
        let boosters = servidor.premiumTier
        let rulesChnnel = servidor.rulesChannel
        let panter = servidor.partnered
        let filterExplixito = servidor.explicitContentFilter
        const bots = servidor.members.cache.filter(b => b.user.bot).size
        const membros = servidor.memberCount

        console.log(criador.username)
        const embed = new EmbedBuilder()
            .setTitle(servidor.name)
            .setColor("Random")
            .setThumbnail(servidor.iconURL({dynamic: true, size: 4096}))
    
            .addFields({ 
                name: "Geral",
                value: `> Posse: ${criador.username}\n> Id do servidor: ${servidor.id}\n> Região: ${regiao}\n> Boosts: ${totalBoosts}\n> Level do boost: ${boosters}\n> Panter: ${panter}`,
                inline: false})
            .addFields({
                name: "Estatísticas usuários",
                value: `> Membros: ${membros}\n> Bots: ${bots}\n> Humanos: ${membros - bots}\n> Total Online: ${total}`,
                inline: false})
            .addFields({
                name: "Presença",
                value: `> Online: ${online}\n> Ausente: ${idle}\n> Não perturbe: ${dnd}\n> Offline: ${offline}`, 
                inline: false})
            .addFields({
                name: "Estatísticas canais",
                value: `> Canais de texto: ${text}\n> Canais de voz: ${voice}\n> Categorias: ${category}\n> Canal de regras: ${rulesChnnel}\n> Canal AFK: ${afkChannel}`,
                inline: false})
            .addFields({
                name: "Proteção",
                value: `> Nivel de verificação: ${nivelVeri}\n> Filtro de conteúdo explícito: ${filterExplixito}`,
                inline: false})
            .addFields({
                name: "Info",
                value: `> Criado em: ${criadoEm}\n> Entrei aqui em: ${entreiEm}`,
                inline: false})
  
            .setImage(servidor.bannerURL({dinamic: false, size: 4096}))
        await interaction.reply({ embeds: [embed] })
    },
};