import type { IBlockchain } from './blockchain'
import Blockchain from './blockchain'
import Block from './block'

describe('Blockchain', () => {
	let bc: IBlockchain

	beforeEach(() => {
		bc = new Blockchain()
	})

	test('should start with the genesis block', () => {
		const expected = Block.genesis()
		const actual = bc.chain[0]
		const { data, hash, lastHash, timestamp } = expected
		expect(actual.data).toEqual(data)
		expect(actual.hash).toEqual(hash)
		expect(actual.lastHash).toEqual(lastHash)
		expect(Math.abs(actual.timestamp - timestamp)).toBeLessThanOrEqual(10) // within 10ms
	})

	test('should add a new block', () => {
		const data = 'foo'
		const newBlock = bc.addBlock(data)
		const actual = bc.chain[bc.chain.length - 1]
		expect(actual.data).toEqual(data)
		expect(actual.hash).toEqual(newBlock.hash)
		expect(actual.lastHash).toEqual(newBlock.lastHash)
		expect(Math.abs(actual.timestamp - newBlock.timestamp)).toBeLessThanOrEqual(10) // within 10ms
	})
})
