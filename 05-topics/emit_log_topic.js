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
    const exchange = 'topic_logs';
    const args = process.argv.slice(2);
    const key = (args.length > 0) ? args[0] : 'anonymous.info';
    const msg = args.slice(1).join(' ') || 'Hello world';

    channel.assertExchange(exchange,'topic',{
        durable: false
    });
    channel.publish(exchange,key,Buffer.from(msg));
    console.log(`[X] sent  ${key} : ${msg}`);
    });

    setTimeout(()=> {
        connection.close();
        process.exit(0);
    },500)
});

//
//node 05-topics/emit_log_topic.js "tickets.payments.info.status" "accepted"
//node 05-topics/emit_log_topic.js "tickets.payments" "accepted"