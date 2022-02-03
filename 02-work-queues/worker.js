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
       
        channel.prefetch(1);
        console.log(`[*] Waiting for messages in ${queue}. CTRL + C to exit`);
        //definimos los segundos que va a tomar cada mensaje en ser procesado (simulando carga)

       channel.consume(queue,(msg)=> {
           const secs = msg.content.toString().split('.').length-1;
        console.log(`[X] Received ${msg.content.toString()}`);
        setTimeout(()=> {
            console.log('[X] Done');
            channel.ack(msg);
        },secs*1000);
       }, {
           noAck: false
       });
    })
})