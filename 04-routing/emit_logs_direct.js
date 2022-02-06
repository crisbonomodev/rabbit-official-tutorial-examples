const amqp = require('amqplib/callback_api');
require('dotenv').config();

amqp.connect(process.env.RABBIT_URL,(error0, connection) => {
    if(error0) {
        throw error0;
    }

    connection.createChannel((error1, channel)=> {
        if(error1) {
            throw error1;
        }

        //creamos nuestro exchange
    const exchange = 'direct_logs';
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello world';
    const severity = (args.length > 0) ? args[0] : 'info';
    channel.assertExchange(exchange,'direct',{
        durable: false
    });
    channel.publish(exchange,severity,Buffer.from(msg));
    console.log(`[X] sent  ${severity} : ${msg}`);
    });

    setTimeout(()=> {
        connection.close();
        process.exit(0);
    },500)
});