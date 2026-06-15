const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("paraver")
    .setDescription("Para verir")
    .addUserOption(o => o.setName("user").setRequired(true))
    .addIntegerOption(o => o.setName("amount").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(i) {

    let money = {};
    if (fs.existsSync("./money.json"))
      money = JSON.parse(fs.readFileSync("./money.json"));

    const user = i.options.getUser("user");
    const amount = i.options.getInteger("amount");

    money[user.id] = (money[user.id] || 0) + amount;

    fs.writeFileSync("./money.json", JSON.stringify(money, null, 2));

    return i.reply(`💰 Para verildi`);
  }
};
