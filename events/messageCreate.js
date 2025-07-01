const db = require('quick.db');
const { EmbedBuilder } = require('discord.js');

module.exports = async (message, client) => {
  if (message.author.bot || !message.guild) return;

  const xpGain = Math.floor(Math.random() * 10) + 5;
  const uid = message.author.id;
  const gid = message.guild.id;

  let xp = (await db.get(`xp_${uid}_${gid}`)) || 0;
  let lvl = (await db.get(`lvl_${uid}_${gid}`)) || 1;

  xp += xpGain;
  const xpNeeded = lvl * 100;

  const canalXPId = await db.get(`canalXP_${gid}`);
  const canalEnvio = message.guild.channels.cache.get(canalXPId) || message.channel;

  if (xp >= xpNeeded) {
    xp -= xpNeeded;
    lvl++;

    const embedUp = new EmbedBuilder()
      .setTitle("📈 Subiu de Nível!")
      .setDescription(`Parabéns ${message.author}, você chegou ao nível **${lvl}**!`)
      .setColor("#00FFAA")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Continue interagindo para ganhar mais XP!", iconURL: message.client.user.displayAvatarURL() });

    canalEnvio.send({ embeds: [embedUp] });

    const cargoId = await db.get(`cargoNivel_${gid}_${lvl}`);
    if (cargoId) {
      const cargo = message.guild.roles.cache.get(cargoId);
      if (cargo && message.guild.members.me.roles.highest.position > cargo.position) {
        try {
          await message.member.roles.add(cargo);
          const embedRole = new EmbedBuilder()
            .setTitle("🎖️ Cargo Conquistado!")
            .setDescription(`${message.author} recebeu o cargo **${cargo.name}** por atingir o nível ${lvl}!`)
            .setColor("#FFD700")
            .setFooter({ text: "Sistema de Recompensas por Nível" });
          canalEnvio.send({ embeds: [embedRole] });
        } catch (e) {
          console.error(e);
          canalEnvio.send(`⚠️ Não consegui adicionar o cargo **${cargo.name}**.`);
        }
      }
    }
  }

  await db.set(`xp_${uid}_${gid}`, xp);
  await db.set(`lvl_${uid}_${gid}`, lvl);

  if (!message.content.startsWith('!')) return;
  const args = message.content.slice(1).split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd);
  if (command) command.execute(message, args, db);
};