import { client } from './bot'
import { Hono } from 'hono'

client.login(Bun.env.DISCORD_TOKEN)

const app = new Hono()

app.get('/', (c) => c.render('Hello World'))

export default app
