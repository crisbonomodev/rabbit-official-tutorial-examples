const amqp = require('amqplib/callback_api');
require('dotenv').config();
const queue = process.env.TASK_QUEUE;

amqp.connect(process.env.RABBIT_URL,(error0, connection)=> {
    if(error0) {
        throw error0;
    }

    console.log('Connected to RabbitMQ');

    connection.createChannel((error1,channel)=> {
        if(error1) {
            throw error1;
        }

        //definimos la queue
        channel.assertQueue(queue,{
            durable: true
        });
        //Pasamos el mensaje por parametro de linea de comando
        const msg = process.argv.slice(2).join(' ') || "Hello World!";

        channel.sendToQueue(queue,Buffer.from(msg),{
            persistent: true
        });
        console.log(`[X] Sent ${msg}`);
    })
})