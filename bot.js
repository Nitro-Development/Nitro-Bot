'use strict';

require('dotenv').config();
const { Client, Message, Guild, WebhookClient, MessageEmbed, GuildMember, DiscordAPIError, Collection} = require('discord.js');
const client = new Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] });

const PREFIX = process.env.PREFIX;
const fs = require('fs');

client.commands = new Collection();

console.log('Authenticating Token!');
client.login (process.env.BOT_TOKEN);
    console.log(process.env.BOT_TOKEN);
console.log('Token has been accepted!');

console.log('Bot is now Starting!');

client.on('ready', async() => {
    console.log(`${client.user.username} Has Successfully Started!`);
    client.user.setActivity(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`, {type: 'WATCHING' });
})

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.on('guildMemberAdd', member => {
    const welcome = member.guild.channels.cache.find(ch => ch.name ==='welcome')
    var role = member.guild.roles.cache.find(role => role.name === 'Member')
    member.roles.add(role)
    let Embed = new MessageEmbed()
        .setTitle('Welcome')
        .setColor('#00a6ff')
        .setDescription(`${member}, Please Verify Yourself! in #verify`)
        .setTimestamp();
    welcome.send(Embed);
});

client.on('messageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '788650077732339746') {
        switch (name) {
        case '🗒️':
            member.roles.add('788649618853724190');
        }
    }
});

client.on('message', async(msg) => {
    if(msg.author.bot || msg.author.client) return;
    if(msg.content.startsWith(PREFIX)) return;
    
    const args = msg.content.trim().slice(PREFIX.length).split(/+/);
    const command = args[0].toLowerCase();

    const cmd = client.commands.get(command);
    if(!cmd) return;
    cmd.run(client, msg, args, Discord);
//
});