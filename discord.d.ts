import {
  Client as BaseClient,
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder as BaseSlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import ping from './src/commands/utility/ping'
import server from './src/commands/utility/server'

declare module 'discord.js' {
  type Commands = typeof ping | typeof server

  export interface GuessOutput<P> {
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<P>
  }

  export type PromiseTypeCommand<T extends GuessOutput> =
    T['execute'] extends (
      (interaction: ChatInputCommandInteraction<CacheType>) => Promise<infer P>
    ) ?
      P
    : never

  type CommandsUnwrapped = GuessOutput<PromiseTypeCommand<Commands>>
  type GotPromises = Collection<
    CommandsUnwrapped['data']['name'],
    CommandsUnwrapped
  >

  export class SlashCommandBuilder implements BaseSlashCommandBuilder {
    setName<const T>(name: T): this & { name: T }
    setDescription<const T>(name: T): this & { description: T }
  }

  export interface Client extends BaseClient {
    commands: GotPromises
  }

  type SetsProps<T> = {
    [P in keyof T]: T[P]
  }
}
