/**
 * Chain Utilities
 * Use elliptic curve for cryptography and creating keys
 */
import EC from 'elliptic'
import { v1 as uuidv1} from 'uuid'
import { SHA256 } from 'crypto-js'

const ec = new EC.ec('secp256k1')

class ChainUtil {
  public static genKeyPair() {
    return ec.genKeyPair()
  }

  public static id(): string {
    return uuidv1()
  }

  /**
   * Hashes JSON data into a sha256 string for signatures
   * @param data string - json data
   * @returns string - hash of the data
   */
  public static hash(data: any): string {
    return SHA256(JSON.stringify(data)).toString()
  }

  /**
   * Verifies the authenticity of a signature for a given transaction's input
   * @param publicKey - The public key of the transaction input
   * @param signature - The signature hash to verify
   * @param dataHash - The data hash to verify against
   * @returns {boolean} If the signature matches to the original one used to hash the data
   */
  public static verifySignature(publicKey: string, signature: string, dataHash: string): boolean {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
  }
}

export default ChainUtil
