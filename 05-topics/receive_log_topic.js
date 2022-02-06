const amqp = require('amqplib/callback_api');
require('dotenv').config();

const args = process.argv.slice(2);
// si no hay parametros indicamos el uso y salimos
if(args.length === 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect(process.env.RABBIT_URL,(error0, connection) => {
    if(error0) {
        throw error0;
    }

    connection.createChannel((error1, channel)=> {
        if(error1) {
            throw error1;
        }

        const exchange = 'topic_logs';

        channel.assertExchange(exchange,'topic',{
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if(error2) {
                throw error2
            }
            console.log(" [*] Waiting for logs. To exit press CTRL+C", q.queue);
            
            //hacemos el bind a la queue segun la severidad
            args.forEach((key) => {
                channel.bindQueue(q.queue, exchange, key);
            });

            channel.consume(q.queue, (msg) => {
                if(msg.content) {
                    console.log(`[X] ${msg.fields.routingKey} :  ${msg.content.toString()}`);
                }
            }, {
                noAck: true
            });
        });
    });
});

//$ node 05-topics/receive_log_topic.js "tickets.*"
//node 05-topics/receive_log_topic.js "*.payments.#"