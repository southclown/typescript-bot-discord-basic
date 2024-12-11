import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { generateAIResponse } from "./function";
import dotenv from "dotenv";

dotenv.config();

export const data = new SlashCommandBuilder()
  .setName("ask")
  .setDescription("Ask anything to AI")
  .addStringOption(option =>
    option
      .setName("question")
      .setDescription("What would you like to ask?")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  if (interaction.guildId !== process.env.GUILD_ID) {
    return await interaction.reply({
      content: "This command can only be used in the specified server.",
      ephemeral: true
    });
  }

  await interaction.deferReply();

  try {
    const question = interaction.options.get("question")?.value as string;
    const response = await generateAIResponse(question);

    await interaction.editReply({
      content: response
    });
  } catch (error) {
    console.error("Error in ask command:", error);
    await interaction.editReply({
      content: "Sorry, an error occurred while processing your request."
    });
  }
}
