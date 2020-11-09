import AsyncStorage from '@react-native-async-storage/async-storage'
import Collection from './asyncstorage'
import { Client } from 'ruqqus-js'

export default function InitClient() {
  let accounts = new Collection('accounts')
  let servers = new Collection('servers')

  return new Promise(async resolve => {
    let activeID = await AsyncStorage.getItem('activeAccount')
    let account = await accounts.findById(activeID)
    let server = await servers.findById(account.serverID)
    let client = new Client({
      domain: server.domain,
      refresh: account.keys.refresh,
      accessToken: account.keys.access,
      id: server.clientID,
      token: server.clientSecret
    })

    await Promise.all([
      new Promise(ready => {
        client.on("login", () => {
          console.log('Logged in')
          ready()
        })
      }),
      new Promise(ready => {
        client.on('refresh', () => {
          console.log('Refreshed tokens')
          ready()
        })
      })
    ])

    resolve(client)
  })
}