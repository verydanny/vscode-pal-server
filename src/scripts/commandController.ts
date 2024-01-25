#! /usr/bin/env bun

import yargs, { type Argv } from 'yargs'
import { hideBin } from 'yargs/helpers'
import { REST, Routes } from 'discord.js'
import ping from '../commands/utility/ping'
import token from '../commands/utility/token'

const commands = [ping.data.toJSON(), token.data.toJSON()]
const rest = new REST().setToken(Bun.env.DISCORD_TOKEN)

// register register [guildIds]
// register deregister [guildIds]
// testGuildId: 1072599609437863946
// 404Guild: 631639705502482439
interface CLI extends Argv {
  guildIds?: string[]
}

interface RestSuccessGuild {
  id: string
  application_id: string
  version: string
  default_member_permissions: null | string
  type: number
  name: string
  name_localizations: null | string
  description: string
  description_localizations: null | string
  guild_id: string
  nsfw: boolean
}

yargs(hideBin(Bun.argv))
  .command(
    ['register [guildIds..]', '$0 [guildIds..]'],
    'register [guildIds..] - Register guild(s), if no guildId(s) provided, it will be global command register',
    () => {},
    (argv: CLI) => {
      if (argv?.guildIds) {
        return register(argv.guildIds)
          .then((data) => {
            console.log(
              `Successfully registered ${data
                .flat()
                .map(({ name, description }) => `${name}: "${description}"`)
                .join(', ')}`
            )
          })
          .catch((err) => console.error(err))
      }
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

export async function register(
  guildIds?: string[]
): Promise<RestSuccessGuild[] | RestSuccessGuild[][]> {
  console.log(`Started refreshing ${commands.length} application (/) commands.`)

  if (guildIds) {
    return Promise.all(
      guildIds.map(
        (guildId) =>
          rest.put(
            Routes.applicationGuildCommands(Bun.env.DISCORD_CLIENT_ID, guildId),
            { body: commands }
          ) as Promise<RestSuccessGuild[]>
      )
    )
  }

  return Promise.all([
    rest.put(Routes.applicationCommands(Bun.env.DISCORD_CLIENT_ID), {
      body: commands,
    }) as Promise<RestSuccessGuild[]>,
  ])
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
