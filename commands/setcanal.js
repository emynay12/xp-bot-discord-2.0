module.exports = {
  name: 'setcanal',
  description: 'Define um canal para onde as mensagens de XP serão enviadas.',
  async execute(message, args, db) {
    if (!message.member.permissions.has('ManageGuild')) {
      return message.reply('❌ Você precisa da permissão **Gerenciar Servidor**.');
    }

    const canal = message.mentions.channels.first();
    if (!canal) {
      return message.reply('⚠️ Use: `!setcanal #canal`');
    }

    await db.set(`canalXP_${message.guild.id}`, canal.id);
    message.channel.send(`✅ As mensagens de XP agora irão para ${canal}.`);
  }
};