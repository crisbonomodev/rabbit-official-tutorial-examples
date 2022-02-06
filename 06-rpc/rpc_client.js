const amqp = require('amqplib/callback_api');
require('dotenv').config();

const args = process.argv.slice(2);
// si no hay parametros indicamos el uso y salimos
if(args.length === 0) {
    console.log("Usage: rpc_client.js num");
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
        //escuchando respuesta
        channel.assertQueue('', {
            exclusive: true
        }, 
        (error2, q) => {
            if(error2) {
                throw error2
            }
            const correlationId = generateUuid();
            const num = parseInt(args[0]);

            console.log(`[x] Requesting fib for ${num}, correlation ID: ${correlationId} `);
            
            channel.consume(q.queue, (msg) => {
                if(msg.properties.correlationId === correlationId) {
                    console.log(`Result is ${msg.content.toString()}`);
                    setTimeout(()=> {
                        connection.close();
                        process.exit(0);
                    },500);
                }
            }, {
                noAck: true
            });
            //envio al RPC queue
            channel.sendToQueue('rpc_queue',
            Buffer.from(num.toString()),{
                correlationId: correlationId,
                replyTo: q.queue
            });
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

//$ node 05-topics/receive_log_topic.js "tickets.*"
//node 05-topics/receive_log_topic.js "*.payments.#"