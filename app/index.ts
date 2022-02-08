import express from 'express'
import Blockchain from '../blockchain'

const PORT = process.env.PORT || 3001

const app = express()
const bc = new Blockchain()

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
	// res.status(200).json()
	// or redirect to return all the blocks
	res.redirect('/blocks')
})

// Open server and listen
app.listen(PORT, () => {
	console.info(`App listening on port ${PORT}`)
})
