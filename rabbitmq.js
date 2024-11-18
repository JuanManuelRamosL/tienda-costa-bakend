const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    const RABBIT_URL = 'amqps://qoofnjpt:RpWrNPKLqQFZmUkQrXp5MhMNL9Du2qcg@jackal.rmq.cloudamqp.com/qoofnjpt';
    const connection = await amqp.connect(RABBIT_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('email.notifications');
    console.log('RabbitMQ conectado.');
}

function getChannel() {
    if (!channel) {
        throw new Error('El canal de RabbitMQ no está inicializado. Asegúrate de llamar a connectRabbitMQ() primero.');
    }
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };
