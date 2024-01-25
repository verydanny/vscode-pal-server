#! /usr/bin/env bun

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { REST, Routes } from 'discord.js'
import ping from '../commands/utility/ping'
import server from '../commands/utility/server'

// register register [guildIds]
// register deregister <guildIds>
const argv = yargs(hideBin(process.argv.slice(2)))
  .command(
    ['register [guildIds..]', '$0 [guildIds..]'],
    'register [guildIds..] - Register guild(s), if no guildId(s) provided, it will be global command register',
    () => {},
    (argv) => {
      console.log('this command will be run by default')
    }
  )
  .command(
    'deregister [guildIds..]',
    'deregister [guildIds..] - de-register guild(s), if no guildId(s) provided, it will be global command de-register',
    () => {},
    (argv) => {
      console.log('This is the de-register command')
    }
  )
  .completion('completions', function (current, argv) {
    return ['register', 'deregister']
  })
  .help()
  .parse()

const commands = [ping.data.toJSON(), server.data.toJSON()]
const rest = new REST().setToken(Bun.env.DISCORD_TOKEN)

export async function register(guildIds?: string[]) {
  console.log(`Started refreshing ${commands.length} application (/) commands.`)

  if (guildIds) {
    return Promise.all(
      guildIds.map((guildId) =>
        rest.put(
          Routes.applicationGuildCommands(Bun.env.DISCORD_CLIENT_ID, guildId),
          { body: commands }
        )
      )
    )
  }

  return rest.put(Routes.applicationCommands(Bun.env.DISCORD_CLIENT_ID), {
    body: commands,
  })
}

export async function deregister(guildIds: string[]) {
  if (guildIds) {
    return Promise.all(
      guildIds.map((guildId) =>
        rest.put(
          Routes.applicationGuildCommands(Bun.env.DISCORD_CLIENT_ID, guildId),
          { body: [] }
        )
      )
    )
  }

  // for global commands
  return rest.put(Routes.applicationCommands(Bun.env.DISCORD_CLIENT_ID), {
    body: [],
  })
}
