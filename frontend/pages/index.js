import { useState, useEffect } from 'react';

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => {
      console.log('Connected to Backend...');
      setMessages((prev) => [...prev, 'Connected to Backend...']);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
      if (data.tradeDetails) console.log( data.tradeDetails);
      if (data.orderResponse) {
        setData(data.orderResponse)
      }
    };
    ws.onclose = () => {
      console.log('Disconnected from Backend');
      setMessages((prev) => [...prev, 'Disconnected from Backend']);
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  const handleTrade = () => {
    if (socket) {
      socket.send('trade');
    }
  };

  return (
    
    <div className="container mx-auto p-4">
      {
        data?
        <div className="mt-4">
        <h2 className="text-xl font-semibold">Order Details:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      :
      <div>
      <h1 className="text-2xl font-bold mb-4">Trade Replication</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleTrade}
      >
        Trade
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Logs:</h2>
        <ul className="list-disc list-inside">
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      </div>
      }
     

    </div>
  );
}
