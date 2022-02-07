import SHA256 from 'crypto-js/sha256'
class Block {
	constructor(public timestamp: number, public lastHash: string, public hash: string, public data: any) {}

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
		return new this(Date.now(), '-----', 'first-h45h', [])
	}

	public static mineBlock(lastBlock: Block, data: any): Block {
		// Generate a new timestamp for block
		const timestamp = Date.now()
		const lastHash = lastBlock.hash
		// create new hash
		const hash = Block.hash(timestamp, lastHash, data)
		// return a new block
		return new this(timestamp, lastHash, hash, data)
	}

	// generate a hash from the timestamp, last hash, and the data
	public static hash(timestamp: number, lastHash: string, data: any): string {
		return SHA256(`${timestamp}${lastHash}${data}`).toString()
	}
}

export default Block;
