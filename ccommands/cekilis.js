const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cekilis")
    .setDescription("Çekiliş başlatır")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(i) {

    const msg = await i.reply({
      content:
`🎉 ÇEKİLİŞ!

🎁 🎉 bas katıl`,
      fetchReply: true
    });

    await msg.react("🎉");

    setTimeout(async () => {

      const fetched = await i.channel.messages.fetch(msg.id);
      const reaction = fetched.reactions.cache.get("🎉");

      if (!reaction)
        return i.followUp("Katılım yok");

      const users = await reaction.users.fetch();
      const list = [...users.filter(u => !u.bot).values()];

      const winner = list[Math.floor(Math.random() * list.length)];

      i.followUp(`🎉 Kazanan: <@${winner.id}>`);

    }, 86400000);
  }
};
