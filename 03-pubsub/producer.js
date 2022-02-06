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
    const exchange = 'logs';

    const msg = process.argv.slice(2).join(' ') || 'Hello world';
        //declaramos el exchange y el tipo de exchange, en este caso fanout
    channel.assertExchange(exchange,'fanout',{
        durable: false
    });
    channel.publish(exchange,'',Buffer.from(msg));
    console.log(`[X] sent ${msg}`);
    });

    setTimeout(()=> {
        connection.close();
        process.exit(0);
    },500)
});