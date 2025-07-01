module.exports = {
  name: 'leaderboard',
  description: 'Shows the top 10 XP users.',
  async execute(message, args, db) {
    const gid = message.guild.id;
    const data = db.all()
      .filter(d => d.ID.endsWith(`_${gid}`) && d.ID.startsWith('xp_'));
    const top = data.sort((a,b)=>b.data - a.data).slice(0,10);

    const list = top.map((u,i) => {
      const userId = u.ID.split('_')[1];
      return `${i+1}. <@${userId}> — ${u.data} XP`;
    }).join('\n') || 'No data yet.';

    message.channel.send(`🏆 **Top 10 XP Users:**\n${list}`);
  }
};