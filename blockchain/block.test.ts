import Block from './block'
import config from '../config'

const { DIFFICULTY } = config

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
		expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY))
		console.log(block.toString())
	})
})
