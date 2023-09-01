/**
 * Example script to discover PH803W devices in your network via UDP packets
 *
 * Usage: node discovery.js
 *
 * To see debug output call like: DEBUG=jebao* node discovery.js
 */

const { JebaoDiscovery } = require('../index');

const discovery = new JebaoDiscovery();

discovery.on('error', err => {
    console.log(`ERROR: ${err}`);
});

discovery.on('device', data => {
    console.log(`PH803W Device ${data.id} discovered on ${data.ip}`);
    console.log(JSON.stringify(data));
});

console.log('Discovering PH803W devices ... CTRL-C to quit');

discovery.discover();