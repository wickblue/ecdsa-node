import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";


function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(signature) {

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      console.log('there');
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function provideSignature(evt) {
    evt.preventDefault();

    try {
      const message = {
        amount: parseInt(sendAmount),
        recipient,
      };
  
      const hashMessage = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
    
      const signature = prompt(`Sign message ('${hashMessage}') with your signature`);
      console.log('here');

      await transfer(signature);

    }
    catch (ex) {
      alert(ex.response.data.message);
    }   
  };


  return (
    <form className="container transfer" onSubmit={provideSignature}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type a name, for example: Brett"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>


      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
