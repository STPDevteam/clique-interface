import { Interface } from '@ethersproject/abi'
import ERC20_ABI from './erc20.json'
import ERC20_BYTES32_ABI from './erc20_bytes32.json'
import STP_ERC20_ABI from './DAOToken.json'
import DAO_ABI from './DAO.json'
import VOTING_ABI from './voting.json'

const ERC20_INTERFACE = new Interface(ERC20_ABI)
const DAO_ERC20_INTERFACE = new Interface(STP_ERC20_ABI)
const DAO_INTERFACE = new Interface(DAO_ABI)
const VOTING_INTERFACE = new Interface(VOTING_ABI)

const ERC20_BYTES32_INTERFACE = new Interface(ERC20_BYTES32_ABI)

export default ERC20_INTERFACE
export { ERC20_ABI, ERC20_BYTES32_INTERFACE, ERC20_BYTES32_ABI, DAO_ERC20_INTERFACE, DAO_INTERFACE, VOTING_INTERFACE }
