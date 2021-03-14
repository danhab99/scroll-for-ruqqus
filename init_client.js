import Collection from './asyncstorage';
import {Client} from 'ruqqus-js';

export default async function InitClient(opts) {
  console.log('INITALIZING NEW CLIENT');
  let c = {};

  if (typeof opts == 'object') {
    c = opts;
  } else {
    let accounts = new Collection('accounts');
    let servers = new Collection('servers');
    let activeID = opts;

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

  return client;
}
