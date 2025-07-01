const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rank',
  description: 'Shows your XP and level.',
  async execute(message, args, db) {
    const uid = message.author.id;
    const gid = message.guild.id;
    const xp = (await db.get(`xp_${uid}_${gid}`)) || 0;
    const lvl = (await db.get(`lvl_${uid}_${gid}`)) || 1;
    const xpNeeded = lvl * 100;

    const barLength = 20;
    const filled = Math.floor((xp / xpNeeded) * barLength);
    const bar = '🟦'.repeat(filled) + '⬛'.repeat(barLength - filled);

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${message.author.username}'s Rank`)
      .setColor("#5865F2")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "🌟 Level", value: `\`${lvl}\``, inline: true },
        { name: "🔹 XP", value: `\`${xp}/${xpNeeded}\``, inline: true },
        { name: "📈 Progress", value: bar, inline: false }
      )
      .setFooter({ text: `Keep chatting to level up!`, iconURL: message.client.user.displayAvatarURL() });

    message.channel.send({ embeds: [embed] });
  }
};