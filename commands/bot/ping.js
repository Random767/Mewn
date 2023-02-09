const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com pong')
		.setDMPermission(false),
	async execute(interaction, client) {
		const m = await interaction.reply({ content: 'Calculando ping...', fetchReply: true })
		await interaction.editReply(`📡 | Pong!\n > Meu ping: ${client.ws.ping}ms\n > Latencia msg: ${m.createdTimestamp - interaction.createdTimestamp}ms\n > Ping API: ${Date.now() - interaction.createdTimestamp}`);
	},
};
