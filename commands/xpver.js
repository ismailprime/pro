const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpver")
    .setDescription("XP verir")
    .addUserOption(o => o.setName("user").setRequired(true))
    .addIntegerOption(o => o.setName("amount").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(i) {

    let xp = {};
    if (fs.existsSync("./xp.json"))
      xp = JSON.parse(fs.readFileSync("./xp.json"));

    const user = i.options.getUser("user");
    const amount = i.options.getInteger("amount");

    xp[user.id] = (xp[user.id] || 0) + amount;

    fs.writeFileSync("./xp.json", JSON.stringify(xp, null, 2));

    return i.reply(`⭐ XP verildi`);
  }
};
