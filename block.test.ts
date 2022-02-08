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
})
