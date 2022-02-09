import SHA256 from 'crypto-js/sha256'
import config from '../config'

const { DIFFICULTY } = config

class Block {
	constructor(public timestamp: string, public lastHash: string, public hash: string, public data: any, public nonce: number) {}

	public toString(): string {
		return `
Block:
	Timestamp....: ${this.timestamp}
	Last Hash....: ${this.lastHash.substring(0, 10)}
	Hash.........: ${this.hash.substring(0, 10)}
	Nonce........: ${this.nonce}
	Data.........: ${this.data}
		`
	}

	public static genesis(): Block {
    // Get today values
    var today = new Date();
    const timestamp = new Date(today.getFullYear(), today.getMonth(),today.getDate()).toUTCString()
		return new this(timestamp, '-----', 'f1r51-h45h', 'genesis', 0)
	}

	public static mineBlock(lastBlock: Block, data: any): Block {
    const lastHash = lastBlock.hash
    // find the nonce
    // increment nonce and loop until we get a hash that matches our difficulty
    let nonce = 0
    let hash: string
    let timestamp: Date
    do {
      // Generate a new timestamp for block and hash it
      nonce++
      timestamp = new Date()
      hash = Block.hash(timestamp.toUTCString(), lastHash, data, nonce)
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY))

		// return a new block
		return new this(timestamp.toUTCString(), lastHash, hash, data, nonce)
	}

	// generate a hash from the timestamp, last hash, and the data
	public static hash(timestamp: string, lastHash: string, data: any, nonce: number): string {
		return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString()
	}

  // returns a hash of the block
  public static blockHash(block: Block): string {
    const { timestamp, lastHash, data, nonce } = block
    const hash = Block.hash(timestamp, lastHash, data, nonce)
    return hash
  }
}

export default Block;
