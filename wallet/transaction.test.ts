import type { IWallet } from '.'
import Wallet from '.'
import type { ITransaction } from './transaction'
import Transaction from './transaction'

describe('Transaction', () => {
	let transaction: ITransaction | undefined
	let wallet: IWallet
	let recipient: string
	let amount: number

	beforeEach(() => {
		wallet = new Wallet()
		amount = 50
		recipient = 'r3c1p13nt'
		transaction = Transaction.newTransaction(wallet, recipient, amount)
	})

	test('should output `amount` subtracted from the wallet balance', () => {
		expect(
			transaction?.outputs.find(output => output.address === wallet.publicKey)?.amount,
		).toEqual(wallet.balance - amount)
	})

	test('should output the `amount` added to the recipient', () => {
		expect(transaction?.outputs.find(output => output.address === recipient)?.amount).toEqual(
			amount,
		)
	})

	test('should input the balance of the wallet', () => {
		expect(transaction?.input.amount).toEqual(wallet.balance)
	})

	describe('validation', () => {
		test('should validate a valid transaction', () => {
			expect(Transaction.verifyTransaction(transaction)).toBe(true)
		})

		test('should invalidate an invalid transaction', () => {
			if (transaction) {
				transaction.outputs[0].amount = 50000
				expect(Transaction.verifyTransaction(transaction)).toBe(false)
			}
		})
	})

	describe('transacting with an amount that exceeds the balance', () => {
		beforeEach(() => {
			amount = 50000
			transaction = Transaction.newTransaction(wallet, recipient, amount)
		})

		test('should not create the transaction', () => {
			expect(transaction).toEqual(undefined)
		})
	})

	describe('updating a transaction', () => {
		let nextAmount: number
		let nextRecipient: string

		beforeEach(() => {
			nextAmount = 20
			nextRecipient = 'n3xt-4ddr355'
			transaction = transaction?.update(wallet, nextRecipient, nextAmount)
		})

		test("should substract the next amount from the sende's output", () => {
			const output = transaction?.outputs.find(output => output.address === wallet.publicKey)
			expect(output?.amount).toEqual(wallet.balance - amount - nextAmount)
		})

		test('should output an amount for the next recipient', () => {
			const output = transaction?.outputs.find(output => output.address === nextRecipient)
			expect(output?.amount).toEqual(nextAmount)
		})
	})
})
