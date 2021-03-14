import Collection, {Value} from './asyncstorage';
import {Client} from 'ruqqus-js';

export default async function InitClient(opts) {
  if (global.ruqqClient && !opts) {
    console.log('RETURNING GLOBAL CLIENT');
    return global.ruqqClient;
  } else {
    console.log('INITALIZING NEW CLIENT');
    let c = {};

    if (opts) {
      c = opts;
    } else {
      let accounts = new Collection('accounts');
      let servers = new Collection('servers');
      let activeID = await Value.getValue('activeAccount');

      if (!activeID) {
        throw new Error('Requires login');
      }

      let account = await accounts.findById(activeID);
      let server = await servers.findById(account.serverID);

      c = {
        domain: server.domain,
        refresh_token: account.keys.refresh,
        access_token: account.keys.access,
        id: server._id,
        token: server.clientSecret,
        auth_domain: 'sfroa.danhab99.xyz',
      };
    }

    let client = new Client(c);

    await Promise.all([
      new Promise((ready) => {
        client.on('login', () => {
          console.log('Logged in');
          ready();
        });
      }),
      new Promise((ready) => {
        client.on('refresh', () => {
          console.log('Refreshed tokens');
          ready();
        });
      }),
    ]);

    global.ruqqClient = client;
    return client;
  }
}
