const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();
fs.readdirSync('./commands').forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
});

fs.readdirSync('./events').forEach(file => {
  const evt = require(`./events/${file}`);
  client.on(file.split('.')[0], (...args) => evt(...args, client));
});

client.login(process.env.TOKEN);