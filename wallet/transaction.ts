import ChainUtil from '../chain-util';
import type { IWallet } from './index'

type TransactionOutput = {
  amount: number,
  address: string
}

type TransactionInput = {
  timestamp: number,
  amount: number,
  address: string,
  signature: string,
}

export interface ITransaction {
  id: string
  input: any
  outputs: TransactionOutput[]
  update(senderWallet: IWallet, recipient: string, amount: number): ITransaction | undefined
}

class Transaction implements ITransaction {
  public id: string = ChainUtil.id()
  public input: TransactionInput | null = null
  public outputs: TransactionOutput[] = []

  // Adds a new transaction output to an existing transaction by the sender
  // Find output that it may have previously generated with a transaction by matching the sender's wallet public key
  public update(senderWallet: IWallet, recipient: string, amount: number): ITransaction | undefined {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey)
    // Cannot transact an amount that would end up being greater than what balance would end up with after
    if (!senderOutput) return
    // Can't exceed balance
    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return
    }
    // Subtract the amount from the sender
    senderOutput.amount = senderOutput.amount - amount
    // New transaction update needs an output, delegated amount and recipient
    this.outputs.push({ amount, address: recipient})
    // Signature won't be valid, generate a new one
    // Sign the transaction with the sender
    Transaction.signTransaction(this, senderWallet)

    return this
  }

  public static newTransaction(senderWallet: IWallet, recipient: string, amount: number): ITransaction | undefined {
    const transaction = new this()

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return undefined
    }

    // Two transactions - deduct from sender, add to recipient
    transaction.outputs.push(...[
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      {
        amount,
        address: recipient
      }
    ])

    // Sign it
    Transaction.signTransaction(transaction, senderWallet)

    return transaction
  }

  // Sign a transaction
  public static signTransaction(transaction: ITransaction, senderWallet: IWallet) {
    // Assign value to input object
    transaction.input = {
      timestamp: Date.now(), // ms
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  /**
   * Verifies that the transaction is valid by checking that the signature used was also used to hash the original data
   * @param transaction The transaction to verify
   * @returns {boolean} - If the transaction is valid or not
   */
  public static verifyTransaction(transaction: ITransaction | undefined): boolean {
     if (!transaction) return false
    return ChainUtil.verifySignature(transaction.input.address, transaction.input.signature, ChainUtil.hash(transaction.outputs))
  }

}

export default Transaction;
