import express from 'express'
import Blockchain from '../blockchain'
import P2pServer from './p2p-server'

const PORT = process.env.HTTP_PORT || process.env.PORT || 3001

const app = express()
const bc = new Blockchain()
const p2pServer = new P2pServer(bc)

// Middleware
app.use(express.json())

// Get blocks from current blockchain
app.get('/blocks', (req, res) => {
	res.json(bc.chain)
	res.status(200).json({ msg: 'Success' })
})

// Add a block
app.post('/mine', (req, res) => {
	const block = bc.addBlock(req.body.data)
	console.log(`New block added: ${block.toString()}`)
	// Sync chains on each added block so chains stay up to date
	p2pServer.syncChains()
	// Get blocks
	res.status(200).json(bc.chain)
})

// Open server and listen
app.listen(PORT, () => {
	console.info(`App listening on port ${PORT}`)
})

// Open web sockets
p2pServer.listen()
