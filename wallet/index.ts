import ChainUtil from '../chain-util'
import config from '../config'
const { INITIAL_BALANCE } = config
import type { ec } from 'elliptic'

export interface IWallet {
  balance: number
  keyPair: ec.KeyPair
  publicKey: string
  toString(): string
  sign(dataHash: string): ec.Signature
}

class Wallet implements IWallet {
  public balance: number = INITIAL_BALANCE
  public keyPair: ec.KeyPair = ChainUtil.genKeyPair()
  public publicKey: string = this.keyPair.getPublic('hex')

  public toString(): string {
		return `
Wallet:
	publicKey....: ${this.publicKey.toString()}
	balance......: ${this.balance}
		`
  }

  // Create a signature based off of the data
  public sign(dataHash: string): ec.Signature {
    return this.keyPair.sign(dataHash)
  }
}

export default Wallet
