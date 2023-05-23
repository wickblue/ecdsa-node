const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

const balances = {
  "0378a65476b78e40fd514bdf10ce59e2e3ec506f350bc17b7d9c7d9bd8731a29bb": 100,
  "03e3e6edde527c48a0f6b9df767041a0e216031d4d4909093ea2b4f3a65a9daab9": 50,
  "03fb664e1de46028782983f386d7316e91efb4680e7fd6f83242d9a0e8a8a36b19": 75,
};

const accounts = {
  "Phil": "0378a65476b78e40fd514bdf10ce59e2e3ec506f350bc17b7d9c7d9bd8731a29bb",
  "Brett": "03e3e6edde527c48a0f6b9df767041a0e216031d4d4909093ea2b4f3a65a9daab9",
  "Cliff": "03fb664e1de46028782983f386d7316e91efb4680e7fd6f83242d9a0e8a8a36b19",
}

app.get("/address/:name", (req, res) => {
  const { name } = req.params;
  const address = accounts[name] || "";
  res.send({ address });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, signature } = req.body;

  const recipientAddress = accounts[recipient];

  let message = JSON.stringify({ amount, recipient });
  let hash = keccak256(utf8ToBytes(message));
  const r_length = Number(signature.slice(-4, -2));
  const s_length = Number(signature.slice(-2));

  const sigObj = {
    'r': BigInt(signature.slice(0,r_length)),
    's': BigInt(signature.slice(r_length, r_length + s_length)),
    'recovery': Number(signature.at(-5)),
  }
  const isValid = secp256k1.verify(sigObj, hash, sender);

  if (isValid) {
    setInitialBalance(sender);
    setInitialBalance(recipientAddress);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipientAddress] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send( {message: "Signature not verified"});
  }
});

app.post("/create", (req, res) => {
  const { newAccount, pubKeyAdd } = req.body;

  if (newAccount in accounts) {
    res.status(400).send({ message: "Account already exists!" });
  } else {
    const newAddress = setInitialAddress(newAccount, pubKeyAdd);
    res.send({ message: "Account created", address: newAddress });
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
};

function setInitialAddress(name, addr) {
  if (!accounts[name]) {
    accounts[name] = addr;
    balances[addr] = 0;
    return addr;
  }
};
