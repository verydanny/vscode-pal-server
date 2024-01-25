import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Replies with server info')

async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply('Server info')
}

export default {
  data,
  execute,
}
