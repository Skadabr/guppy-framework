import {
    Destination, AcknowledgeMode, MessageProducer, MessageConsumer, Message, Session, Connection,
    ConnectionFactory
} from "./common";

type Queue = Destination;

interface QueueConnectionFactory extends ConnectionFactory {
    createQueueConnection(): QueueConnection;
}

interface QueueConnection extends Connection {
    createQueueSession(transacted: boolean, acknowledgeMode: AcknowledgeMode): QueueSession;
}

interface QueueSession extends Session {
    createSender(queue: Queue): QueueSender;
    createReceiver(queue: Queue): QueueReceiver;
}

interface QueueSender extends MessageProducer {

}

interface QueueReceiver extends MessageConsumer {

}
// ===

const targetQueue: Queue = "users.fetch-summary";

const connectionFactory: QueueConnectionFactory = null;
const connection: QueueConnection = connectionFactory.createQueueConnection();
const session: QueueSession = connection.createQueueSession(false, AcknowledgeMode.AutoAcknowledge);

connection.start();

const receiver: QueueReceiver = session.createReceiver(targetQueue);

receiver.setMessageListener((message: Message) => {
    console.log(
        message.getRaw().toString()
    );
});

const queueSender: QueueSender = session.createSender(targetQueue);

queueSender.send(
    session.createTextMessage("Hello!")
);

queueSender.close();