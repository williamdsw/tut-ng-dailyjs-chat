"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var ChatServer = /** @class */ (function () {
    // CONSTRUCTOR
    function ChatServer() {
        this.app = express();
        this.server = http_1.createServer(this.app);
        this.port = process.env.PORT || ChatServer.PORT;
        this.io = socketIo(this.server);
        this.listen();
    }
    // HELPER FUNCTIONS
    ChatServer.prototype.listen = function () {
        var _this = this;
        // escuta na porta especifica
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        // evento de conexao
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            // quando recebe a mensagem
            socket.on('message', function (message) {
                console.log('[server](message): %s', JSON.stringify(message));
                _this.io.emit('message', message);
            });
            // quando usuario desconecta (sai)
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    ChatServer.prototype.getApp = function () {
        return this.app;
    };
    // FIELDS
    ChatServer.PORT = 8080;
    return ChatServer;
}());
exports.ChatServer = ChatServer;
