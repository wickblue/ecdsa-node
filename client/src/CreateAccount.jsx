import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";


function CreateAccount() {
  const [newAccountName, setNewAccountName] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function generateKeys(evt) {
    evt.preventDefault();

    const name = evt.target.value;

    if (name) {
        const {
            data: { address },
        } = await server.get(`address/${name}`);
        setPubKey(address);
        setPrivKey('secret');
    } else {
        const priv = secp256k1.utils.randomPrivateKey();
        setPubKey(toHex(secp256k1.getPublicKey(priv)));
        setPrivKey(toHex(priv));
    }

  }

  async function createAccount(evt) {
    evt.preventDefault();
    try {
        const response = await server.post(`create/`, {
          newAccount: newAccountName,
          pubKeyAdd: pubKey,
        });
  
        setSuccessMessage(response.data.message); // Set the success message from the server response

      } catch (ex) {
        alert(ex.response.data.message);
      }
  }


  return (
    <div>
        <div className="container genKeys">
        <h1>Create Account</h1>

        <label>
            Account Name
            <input placeholder="Type a name, for example: Phil" value={newAccountName} onChange={setValue(setNewAccountName)}></input>
        </label>

        <button type="button" className="button" onClick={generateKeys}>Generate Keys</button>
        <label>
            Private Key (save this!):
            <div className="address">{privKey}</div>
        </label>
        <label>
            Public Key:
        <div className="publicKey">{pubKey}</div>
        </label>


        <div className="createAccountcontainer">
        <button type="button" className="button" onClick={createAccount}>Create Account</button>
        {successMessage && <p>{successMessage}</p>}
        </div>
        </div>

    </div>
  );
}

export default CreateAccount;