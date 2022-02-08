import Block from './block'

// Build as singly linked list
export interface IBlockchain {
  chain: Block[]
  addBlock(data: any): Block
  isValidChain(chain: Block[]): boolean
  replaceChain(newChain: Block[]): void
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

  public isValidChain(chain: Block[]): boolean {
    // Check that incoming chain starts with genesis block
    const currGen = JSON.stringify(this.chain[0])
    const gen = JSON.stringify(Block.genesis())
    if (currGen !== gen) return false

    // Go through every block and run validation on the block
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i-1]

      // Check that last hash matches the hash of last block
      // Or, check that data hasn't been tampered with and is correct
      // Compare hash links and hashed data
      if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) return false
    }

    return true
  }

  // Replace's the current chain with the new chain completely
  // If same length, likely same chain, choosing longer chain resolves forking issues
  public replaceChain(newChain: Block[]): void {
    if (newChain.length <= this.chain.length) {
      console.warn('New chain length must be greater than the current chain');
      return
    }

    // Must be a valid chain
    if (!this.isValidChain(newChain)) {
      console.warn('The received chain is not valid');
      return
    }

    console.info('Replacing blockchain with the new chain');
    this.chain = newChain
  }
}

export default Blockchain
