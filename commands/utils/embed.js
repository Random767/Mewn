const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('[Utils] Crie embeds')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('create')
                .setDescription('[Utils] Crie uma embed')
                .addChannelOption((options) =>
                options
                    .setName('canal')
                    .setDescription('Quer enviar a embed em qual canal?')
                )
                .addStringOption((options) =>
                    options
                        .setName('titulo')
                        .setDescription('Qual titulo da embed você quer colocar?')
                )

                .addStringOption((options) =>
                    options
                        .setName('descrição')
                        .setDescription('Qual a descrição da embed?')
                )
                .addStringOption((options) =>
                    options
                        .setName('imagem')
                        .setDescription('Digite a url de uma imagem')
                )
                .addStringOption((options) =>
                    options
                        .setName('thumbnail')
                        .setDescription('Digite a url de uma imagem')
                )
                .addStringOption((options) =>
                options
                    .setName('rodapé')
                    .setDescription('O que deseja colocar no rodapé?')
                )
        ),
    async execute(interaction){
        const channel = interaction.options.getChannel('canal') || interaction.channel
        const options = function(arg){
            return interaction.options.getString(arg)
        }
        let embed = {
            image:{
                "url": null
            },
            thumbnail:{
                "url": null
            },
            color: 0x2f3136
        }
        if(options('titulo') == null && options('descrição') == null && options('imagem') == null && options('thumbnail') == null){
            return await interaction.reply(':octagonal_sign: | Preciso de pelo menos um argumento para criar a embed!')
        }

        embed['title'] = options('titulo')
        embed['description'] = options('descrição')
        embed['image']['url'] = options('imagem')
        embed['thumbnail']['url'] = options('thumbnail')

        interaction.reply(`:white_check_mark: | Embed criada com sucesso!`)
        channel.send({ embeds:[embed] })
    }
}