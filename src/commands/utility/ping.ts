import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

const data = new SlashCommandBuilder()
  .setDescription('Replies with Pong!')
  .setName('ping')

async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply('Pong!')

  return false
}

export default {
  data,
  execute,
}
