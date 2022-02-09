import SHA256 from 'crypto-js/sha256'
import config from '../config'

const { DIFFICULTY, MINE_RATE } = config

class Block {
  // TODO: timestamp should be number, could fix bugs
	constructor(public timestamp: string, public lastHash: string, public hash: string, public data: any, public nonce: number, public difficulty: number) {}

	public toString(): string {
		return `
Block:
	Timestamp....: ${this.timestamp}
	Last Hash....: ${this.lastHash.substring(0, 10)}
	Hash.........: ${this.hash.substring(0, 10)}
	Nonce........: ${this.nonce}
	Difficulty...: ${this.difficulty}
	Data.........: ${this.data}
		`
	}

	public static genesis(): Block {
    // Get today values
    var today = new Date();
    const timestamp = new Date(today.getFullYear(), today.getMonth(),today.getDate()).toUTCString()
		return new this(timestamp, '-----', 'f1r51-h45h', 'genesis', 0, DIFFICULTY)
	}

	public static mineBlock(lastBlock: Block, data: any): Block {
    const lastHash = lastBlock.hash
    let { difficulty } = lastBlock
    // find the nonce
    // increment nonce and loop until we get a hash that matches our difficulty
    let nonce = 0
    let hash: string
    let timestamp: Date
    do {
      // Generate a new timestamp for block and hash it
      nonce++
      timestamp = new Date()
      // Adjust difficulty based on timestamp of last block
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
      hash = Block.hash(timestamp.toUTCString(), lastHash, data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

		// return a new block
		return new this(timestamp.toUTCString(), lastHash, hash, data, nonce, difficulty)
	}

	// generate a hash from the timestamp, last hash, and the data
	public static hash(timestamp: string, lastHash: string, data: any, nonce: number, difficulty: number): string {
		return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
	}

  // returns a hash of the block
  public static blockHash(block: Block): string {
    const { timestamp, lastHash, data, nonce, difficulty } = block
    const hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
    return hash
  }

  public static adjustDifficulty(lastBlock: Block, currTime: Date): number {
    let { difficulty } = lastBlock
    // Compare time to mine to our mine rate constant
    // If less than, mining was too easy, increase difficulty
    // If more than, mining was too hard, decrease difficulty
    difficulty = new Date(lastBlock.timestamp).getTime() + MINE_RATE > currTime.getTime() ? difficulty + 1 : difficulty - 1
    return difficulty
  }
}

export default Block;
