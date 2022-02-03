//requerimos la libreria
const amqp = require('amqplib/callback_api');

const sendMessage = (req,res) => {
//nos conectamos a rabbit
amqp.connect(process.env.RABBIT_URL,(error0,connection)=> {
//si hay error de conexion    
if(error0) {
        throw error0;
    }
//Creamos un canal
    connection.createChannel(async (error1,channel) => {
        //para poder enviar debemos declarar una queue a la que enviar, entonces podemos publicar el mensaje
        if(error1) {
            throw error1;
        }
        const queue = 'hello';
        const {from, message} = req.body;
        console.log(`Message Received from ${from}: ${message}`);
        channel.assertQueue(queue,{
            durable: false
        });
        const parsedMessage = JSON.stringify({from,message});
       await channel.sendToQueue(queue,Buffer.from(parsedMessage));
        console.log(`Message sent to queue ${queue}: ${message}`);
    });
    setTimeout(function() {
        connection.close();
        return res.send('Message sent');
        }, 500);
});
}

module.exports = {sendMessage};