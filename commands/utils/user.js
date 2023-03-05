const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`user`)
        .setDescription(`[UTILS] Veja informações de um usuário`)
        .setDMPermission(false)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('info')
                .setDescription('[UTILS] Veja informações de um usuário')
                .addUserOption(
                    option => option.setName('usuário')
                        .setDescription('Deseja ver informações de qual usuário?')
                        .setRequired(false)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('avatar')
                .setDescription('[UTIlS] Veja o avatar de um usuário')
                .addUserOption(option =>
                    option.setName('usuário')
                        .setDescription('Deseja ver o avatar de qual usuário?')
                        .setRequired(false))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() == 'info') {
            const getUser = interaction.options.getUser('usuário') || interaction.user
            if (!getUser) {
                await interaction.reply({ content: "Desculpe, não consegui encontrar o usuário", ephemeral: true })
                return
            }
            const memberinfo = interaction.guild.members.cache.get(`${getUser.id}`)

            const uname = getUser.username
            const unickname = uname ?? memberinfo.nickname
            const utag = getUser.tag
            const uid = getUser.id
            const ucreatedat = `${moment(getUser.createdAt).format('LLL')} (${moment(getUser.createdAt).fromNow()})`
            const uavatar = getUser.displayAvatarURL({ dynamic: true })

            function isMember() {
                let result = interaction.guild.members.cache.filter(a => a.id === getUser.id).size
                if (result === 1) {
                    return true
                } else {
                    return false
                }
            }

            if (isMember()) {
                let upresence = memberinfo?.presence?.status ?? 'offiline';
                const ujoined = `${moment(memberinfo.joinedTimestamp).format('LLL')} (${moment(memberinfo.joinedTimestamp).fromNow()})`

                const embed = new EmbedBuilder()
                    .setTitle(unickname)
                    .addFields({
                        name: "Tag",
                        value: utag,
                        inline: true
                    })
                    .addFields({
                        name: "Id",
                        value: uid,
                        inline: true
                    })
                    .addFields({
                        name: "Presença",
                        value: upresence,
                        inline: true
                    })
                    .addFields({
                        name: "Conta criada em",
                        value: ucreatedat,
                        inline: true
                    })
                    .addFields({
                        name: "Entrou aqui em",
                        value: ujoined,
                        inline: true
                    })
                    .setThumbnail(uavatar)
                    .setColor('#2f3136')

                await interaction.reply({ embeds: [embed] });
                return
            } else {
                const inServer = new EmbedBuilder()
                    .setTitle(uname)
                    .addFields({
                        name: "Tag",
                        value: utag,
                        inline: true
                    })
                    .addFields({
                        name: "Id",
                        value: uid,
                        inline: true
                    })
                    .addFields({
                        name: "Conta criada em",
                        value: ucreatedat,
                        inline: true
                    })
                    .setThumbnail(uavatar)
                    .setColor('#2f3136')

                await interaction.reply({ embeds: [inServer] });
                return

            }
        } else if(interaction.options.getSubcommand() == 'avatar'){
            const user = interaction.options.getUser('usuário') || interaction.user
            const png = user.displayAvatarURL({ dynamic: true, size: 4096, format: "png" })
            const jpg = user.displayAvatarURL({ dynamic: true, size: 4096, format: "jpg" })
            const webp = user.displayAvatarURL({ dynamic: true, size: 4096, format: "webp" })
            
            const embed = new EmbedBuilder()
                .setTitle(`🖼️ | Avatar de ${user.username}`)
                .setDescription(`Baixar avatar [png](${png}) | [jpg](${jpg}) | [webp](${webp})`)
                .setImage(png)
                .setColor('#2f3136')
                .setTimestamp()
    
            await interaction.reply(({ embeds: [embed] }));
        }
    },
};