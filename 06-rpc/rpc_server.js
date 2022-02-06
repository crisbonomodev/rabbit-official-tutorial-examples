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

        const queue = 'rpc_queue';

        channel.assertQueue(queue,{
            durable: false
        });

        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');

        channel.consume(queue, function reply(msg) {
            console.log(`received request, correlation id ${msg.properties.correlationId}`);
            const n = parseInt(msg.content.toString());

            const result = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()),{
                correlationId: msg.properties.correlationId
            });
            channel.ack(msg);
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1)
      return n;
    else
      return fibonacci(n - 1) + fibonacci(n - 2);
  }

//$ node 05-topics/receive_log_topic.js "tickets.*"
//node 05-topics/receive_log_topic.js "*.payments.#"