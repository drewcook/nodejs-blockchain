import type { IBlockchain } from './blockchain'
import Blockchain from './blockchain'
import Block from './block'

describe('Blockchain', () => {
	let bc: IBlockchain
	let bc2: IBlockchain

	beforeEach(() => {
		bc = new Blockchain()
		bc2 = new Blockchain()
	})

	test('should start with the genesis block', () => {
		const expected = Block.genesis()
		const actual = bc.chain[0]
		expect(actual).toEqual(expected)
	})

	test('should add a new block', () => {
		const data = 'foo'
		const newBlock = bc.addBlock(data)
		const actual = bc.chain[bc.chain.length - 1]
		expect(actual).toEqual(newBlock)
	})

	describe('validation', () => {
		test('should validate a valid chain', () => {
			bc2.addBlock('foo')
			expect(bc.isValidChain(bc2.chain)).toBe(true)
		})

		xtest('should invalidate a chain with a corrupt genesis block', () => {
			// corrupt it
			console.log(bc2.chain[0])
			bc2.chain[0].data = 'bad data'
			console.log(bc2.chain[0])
			expect(bc.isValidChain(bc2.chain)).toBe(false)
		})

		test('should invalidate a corrupt chain', () => {
			// add and corrupt it
			bc2.addBlock('foo')
			bc2.chain[1].data = 'not foo'
			expect(bc.isValidChain(bc2.chain)).toBe(false)
		})
	})

	describe('replacing the chain', () => {
		test('should replace the chain with a valid chain', () => {
			bc2.addBlock('goo')
			bc.replaceChain(bc2.chain)
			expect(bc.chain).toEqual(bc2.chain)
		})

		test('should require that new chain must be longer', () => {
			bc.addBlock('one')
			bc.addBlock('two')
			bc.addBlock('three')
			bc.replaceChain(bc2.chain)
			expect(bc.chain).not.toEqual(bc2.chain)
		})
	})
})
