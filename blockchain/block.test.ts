import Block from './block'

describe('Block', () => {
	let data: any
	let lastBlock: Block
	let block: Block

	beforeEach(() => {
		data = 'bar'
		lastBlock = Block.genesis()
		block = Block.mineBlock(lastBlock, data)
	})

	test('should set the `data` to match the input', () => {
		expect(block.data).toEqual(data)
	})

	test('should set the `lastHash` to match the hash of hte last block', () => {
		expect(block.lastHash).toEqual(lastBlock.hash)
	})

	test('should generate a hash that matches the difficulty', () => {
		expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty))
	})

	test('should lower the mining difficulty for slowly mined blocks', () => {
		const date = new Date(block.timestamp).getTime()
		expect(Block.adjustDifficulty(block, new Date(date + 360000))).toEqual(block.difficulty - 1)
	})

	test('should increase the mining difficulty for quickly mined blocks', () => {
		const date = new Date(block.timestamp).getTime()
		expect(Block.adjustDifficulty(block, new Date(date + 1))).toEqual(block.difficulty + 1)
	})
})
