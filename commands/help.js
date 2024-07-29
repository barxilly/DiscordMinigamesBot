module.exports = {
    data: {
        name: 'help',
        description: 'Provides a list of commands.',
        "integration_types": [0,1],
        "contexts": [0, 1, 2],

    },
    async execute(interaction, client) {
        var reply = 'Here is a list of available commands:\n';
        client.commands.forEach(command => {
            reply += `/${command.data.name} - ${command.data.description}\n`;
        });
        await interaction.reply(reply);
    },
};