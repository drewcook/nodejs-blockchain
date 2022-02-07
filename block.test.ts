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

	it('sets the `data` to match the input', () => {
		expect(block.data).toEqual(data)
	})

	it('should sets the `lastHash` to match the hash of hte last block', () => {
		expect(block.lastHash).toEqual(lastBlock.hash)
	})
})
