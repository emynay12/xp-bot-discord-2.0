module.exports = {
  name: 'setcargo',
  description: 'Define um cargo para ser entregue ao atingir certo nível.',
  async execute(message, args, db) {
    if (!message.member.permissions.has('ManageRoles')) {
      return message.reply('❌ Você precisa da permissão **Gerenciar Cargos**.');
    }

    const nivel = parseInt(args[0]);
    const role = message.mentions.roles.first();

    if (!nivel || !role) {
      return message.reply('⚠️ Use: `!setcargo <nível> @cargo`');
    }

    await db.set(`cargoNivel_${message.guild.id}_${nivel}`, role.id);
    message.channel.send(`✅ Cargo **${role.name}** será entregue ao atingir o nível **${nivel}**.`);
  }
};