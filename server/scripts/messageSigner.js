const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");


PRIVATE_KEY = "eff147a87880db6905e4dd0d81b041fd6f969d539ac02e43d1128289661ed2bd";

const hashMessage = "62e43bc2ec28dc45ba34a47c08d62dd06024fa876526890c6d9717794c187293";

const hash = hexToBytes(hashMessage);

const sig = secp256k1.sign(hash, PRIVATE_KEY);

const sigString = BigInt(sig['r']).toString() + BigInt(sig['s']).toString() + sig['recovery'].toString() + BigInt(sig['r']).toString().length + BigInt(sig['s']).toString().length;

console.log('Here is your signature: ', sigString);



