const { REST, Routes } = require("discord.js");

const commands = []; // senin komutlar

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Slash yükleniyor...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash HAZIR (guild)");
  } catch (err) {
    console.log(err);
  }
})();
