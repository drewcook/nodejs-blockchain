import Block from './block'

// Build as singly linked list
export interface IBlockchain {
  chain: Block[]
  addBlock(data: any): Block
}

class Blockchain implements IBlockchain{
	public chain: Block[] = [Block.genesis()]

  public addBlock(data: any): Block {
    // Get tail
    const lastBlock: Block = this.chain[this.chain.length-1]
    // Generate new block
    const block = Block.mineBlock(lastBlock, data)
    // Add it and return it
    this.chain.push(block)
    return block
  }
}

export default Blockchain
