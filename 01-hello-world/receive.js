//requerimos la libreria
const amqp = require('amqplib/callback_api');

const receiveMessages = (req,res) => {
    //creamos la conexion
    amqp.connect(process.env.RABBIT_URL,(error0,connection)=> {
        if(error0) {
            throw error0;
        }
    //abrimos un canal
    connection.createChannel((error1,channel)=> {
        if(error1) {
            throw error1;
        }

        const queue = process.env.QUEUE;
        //declaramos la queue y la buscamos
        channel.assertQueue(queue,{
            durable: false
        });
        //recibimos los mensajes
        channel.consume(queue,(msg)=> {
            const message = msg.content.toString();
            return res.send(JSON.parse(message));
        },{
            noAck: true
        })
    })
    })
}

module.exports = {receiveMessages};