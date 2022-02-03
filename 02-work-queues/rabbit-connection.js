const amqp = require('amqplib/callback_api');
const queue = process.env.TASK_QUEUE;
require('dotenv').config();

class RabbitConnection {
    constructor() {
        this.connection = this.connect();
        this.channel = this.createChannel();
    }

    connect() {
        amqp.connect(process.env.RABBIT_URL,(error0, connection)=> {
            if(error0) {
                throw error0;
            }
        return connection;
        })
    }

    createChannel() {
        this.connection.createChannel(function(error1, channel) {
            if (error1) {
              throw error1;
            }
            var queue = 'task_queue';
            var msg = process.argv.slice(2).join(' ') || "Hello World!";
        
            channel.assertQueue(queue, {
              durable: true
            });

            return channel;
        })
    }

    sendToQueue(msg) {
        this.channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
          });
    }

    close() {
        this.connection.close();
    }
}

module.exports = {RabbitConnection};

