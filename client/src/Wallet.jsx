import server from "./server";

function Wallet({ name, setName, address, setAddress, balance, setBalance }) {
  
  async function displayBalance(address) {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  
  async function displayAddress(evt) {
    const name = evt.target.value;
    setName(name);
    if (name) {
      const {
        data: { address },
      } = await server.get(`address/${name}`);
      setAddress(address);
      return address;
    } else {
      setAddress("");
      return "";
    }
  }

async function onChange(evt) {
  const address =  await displayAddress(evt);
  await displayBalance(address);
}
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Account Name
        <input placeholder="Type a name, for example: Phil" value={name} onChange={onChange}></input>
      </label>

      <div className="address">Address: {address}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
