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
}

class Transaction implements ITransaction {
  public id: string = ChainUtil.id()
  public input: TransactionInput | null = null
  public outputs: TransactionOutput[] = []

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
