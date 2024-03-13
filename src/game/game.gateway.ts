// eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
// import { CreateGameDto } from './dto/create-game.dto';
// import { UpdateGameDto } from './dto/update-game.dto';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todos los orígenes, pero deberías restringirlo en producción
    credentials: true, // Soporte para cookies y encabezados de autorización
  },
})
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly gameService: GameService) { }

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      console.log('Cliente conectado');

      // Emitir mensaje de bienvenida al cliente conectado
      client.emit('bienvenida', 'Bienvenido al servidor de juego!');

      client.on('chat message', (msg: string) => {
        console.log('message: ' + msg);
        // Aquí asumo que quieres emitir el mensaje que recibiste, no la string 'msg'
        this.server.emit('chat message', msg);
      });

      client.on('disconnect', () => {
        console.log('Cliente desconectado');
        // Opcionalmente, notificar a otros clientes que alguien se desconectó
        client.broadcast.emit('notificacion', 'Un cliente se ha desconectado');
      });
    });
  }

  // @SubscribeMessage('createGame')
  // create(@MessageBody() createGameDto: CreateGameDto) {
  //   return this.gameService.create(createGameDto);
  // }

  // @SubscribeMessage('findAllGame')
  // findAll() {
  //   return this.gameService.findAll();
  // }

  // @SubscribeMessage('findOneGame')
  // findOne(@MessageBody() id: number) {
  //   return this.gameService.findOne(id);
  // }

  // @SubscribeMessage('updateGame')
  // update(@MessageBody() updateGameDto: UpdateGameDto) {
  //   return this.gameService.update(updateGameDto.id, updateGameDto);
  // }

  // @SubscribeMessage('removeGame')
  // remove(@MessageBody() id: number) {
  //   return this.gameService.remove(id);
  // }
}
