import Block from './blockchain/block'

// Mine a block
const fooBlock = Block.mineBlock(Block.genesis(), 'foo')
console.log(fooBlock.toString())
