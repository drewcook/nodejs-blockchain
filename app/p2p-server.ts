import ws from 'ws'
import Blockchain from '../blockchain'

// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
const P2P_PORT = process.env.P2P_PORT || 5001
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : []

class P2pServer {
  public sockets: ws[]
  public blockchain: Blockchain

  constructor(_blockchain: Blockchain) {
    this.blockchain = _blockchain
    this.sockets = []
  }

  public listen(): void {
    const server = new ws.WebSocketServer({ port: parseInt(P2P_PORT.toString()) })

    server.on('connection', socket => this.connectSocket(socket))
    // Connect to all peers
    this.connectToPeers()

    console.info(`Listening for peer-to-peer connections on ${P2P_PORT}`);
  }

  private connectSocket(socket: ws): void {
    this.sockets.push(socket)
    console.info('Socket connected');
  }

  private connectToPeers(): void {
    peers.forEach(peer => {
      // ws://localhost:5001
      // Create a new web socket for peer
      const socket = new ws(peer)
      // Connect to the socket
      socket.on('open', () => {
        this.connectSocket(socket)
      })
    })
  }
}

export default P2pServer;
