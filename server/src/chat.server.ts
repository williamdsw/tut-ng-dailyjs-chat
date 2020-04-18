import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message } from './model/message';

export class ChatServer {

    // FIELDS

    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    // CONSTRUCTOR

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.port = process.env.PORT || ChatServer.PORT;
        this.io = socketIo(this.server);
        this.listen();
    }

    // HELPER FUNCTIONS

    private listen(): void {

        // escuta na porta especifica
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        // evento de conexao
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);

            // quando recebe a mensagem
            socket.on('message', (message: Message) => {
                console.log('[server](message): %s', JSON.stringify(message));
                this.io.emit('message', message);
            });

            // quando usuario desconecta (sai)
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

}