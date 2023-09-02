/**
 * Example script to get Data from a PH803W device
 *
 * Usage: node data.js <IP address>
 *
 * To see debug output call like: DEBUG=jebao* node data.js <IP address>
 */

const { JebaoDevice, JebaoActions } = require('../index');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAction(device, action) {
    if (action) {
        console.log(`Wait ` + action.delay + `ms before : ` + action.message);
        await delay(action.delay);
        console.log(`Execute now : ` + action.message);
        await device.sendAction(action.action);
    } else {
        console.log(`Wait 5000ms before close the socket ! ☠️`);
        await delay(5000);
        console.log(`Close the socket ! ☠️`);
        device.destroy();
    }
}

async function main() {
    const device = new JebaoDevice(process.argv[2], {autoReconnect: false});

    const actions = [
        {
            message: 'Start Pump 2 👍',
            action: JebaoActions.pump2_start,
            delay: 3000 // applied before action
        },
        {
            message: 'Stop Pump 2 👎',
            action: JebaoActions.pump2_stop,
            delay: 5000
        }
    ];

    device.on('error', err => {
        console.log('Error: ' + err);
    });

    device.on('data', data => {
        console.log('Data: ' + JSON.stringify(data));
    });

    device.on('sent', async data => {
        // console.log('Data: ' + JSON.stringify(data));
        // console.log(`Sent emitted`);
        await processAction(device, actions.shift());
    });

    device.on('connected', async () => {
        console.log(`CONNECT 🚀`);
        await device.login();
        await device.retrieveData();

        await processAction(device, actions.shift());

        console.log('DONE 🔥');
        // await device.destroy();
    });

    await device.connect();
}

if (process.argv.length !== 3) {
    console.log('Usage: node data.js 111.222.333.444');
    process.exit();
}

main();
