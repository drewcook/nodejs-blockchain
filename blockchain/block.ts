import SHA256 from 'crypto-js/sha256'
class Block {
	constructor(public timestamp: string, public lastHash: string, public hash: string, public data: any) {}

	public toString(): string {
		return `
Block:
	Timestamp....: ${this.timestamp}
	Last Hash....: ${this.lastHash.substring(0, 10)}
	Hash.........: ${this.hash.substring(0, 10)}
	Data.........: ${this.data}
		`
	}

	public static genesis(): Block {
    // Get today values
    var today = new Date();
    const timestamp = new Date(today.getFullYear(), today.getMonth(),today.getDate()).toUTCString()
		return new this(timestamp, '-----', 'f1r51-h45h', 'genesis')
	}

	public static mineBlock(lastBlock: Block, data: any): Block {
		// Generate a new timestamp for block
		const timestamp = new Date()
		const lastHash = lastBlock.hash
		// create new hash
		const hash = Block.hash(timestamp.toUTCString(), lastHash, data)
		// return a new block
		return new this(timestamp.toUTCString(), lastHash, hash, data)
	}

	// generate a hash from the timestamp, last hash, and the data
	public static hash(timestamp: string, lastHash: string, data: any): string {
		return SHA256(`${timestamp}${lastHash}${data}`).toString()
	}

  // returns a hash of the block
  public static blockHash(block: Block): string {
    const { timestamp, lastHash, data } = block
    const hash = Block.hash(timestamp, lastHash, data)
    return hash
  }
}

export default Block;
