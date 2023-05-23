import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import CreateAccount from "./CreateAccount";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");


  return (
    <div className="app">
      <CreateAccount>
      </CreateAccount>
      <Wallet
        name={name}
        setName={setName}
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
