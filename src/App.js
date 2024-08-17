import { useState, useEffect } from "react";
import "./App.css";
import useGituserInfo from "./useGituserInfo";

function App() {
  const [username, setUsername] = useState("");
  const { user, loading, error, fetchUserData } = useGituserInfo(username);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFetchUserData = () => {
    fetchUserData(username);
  };

  const [counters, setCounters] = useState([0, 0, 0, 0, 0]); // Initial counter values
  const [ticketInput, setTicketInput] = useState("");
  const [assignedCounter, setAssignedCounter] = useState();
  const [leastBusyCounterIndex, setLeastBusyCounterIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prevCounters) =>
        prevCounters.map((count) => Math.max(0, count - 1))
      );
    }, 1000); // Decrement counters every second

    if (assignedCounter && counters[assignedCounter - 1] === 0) {
      setAssignedCounter(null);
      setTimeout(() => {
        setAssignedCounter(undefined);
      }, 3000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [assignedCounter, counters]);

  const handleTicketProcess = () => {
    const numTickets = parseInt(ticketInput);
    if (!isNaN(numTickets) && numTickets > 0) {
      setLeastBusyCounterIndex(counters.indexOf(Math.min(...counters)));
      setCounters((prevCounters) => {
        const newCounters = [...prevCounters];
        newCounters[leastBusyCounterIndex] += numTickets;
        setAssignedCounter(leastBusyCounterIndex + 1);
        return newCounters;
      });
    }
  };

  const handleTicketInputChange = (e) => {
    setTicketInput(e.target.value);
  };

  const handleClearInput = () => {
    setTicketInput("");
  };

  const showCounters = counters.map((count, index) => (
    <div key={index} className="counter">
      <h3>Counter {index + 1}</h3>
      <p>Tickets in Queue: {count}</p>
    </div>
  ));

  return (
    <div className="App">
      <div>
        <label>Enter your Github username: </label>
        <input type="text" onChange={handleInputChange} value={username} />{" "}
        <button onClick={handleFetchUserData}>Process</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {user && (
          <div>
            <div>Name: {user.name}</div>
            <div>Location: {user.location}</div>
            <div>Public Repos: {user.public_repos}</div>
          </div>
        )}
      </div>
      <div>
        <h2>Ticket Queue System</h2>
        <input
          type="number"
          onChange={handleTicketInputChange}
          value={ticketInput}
          min="1"
        />{" "}
        <button onClick={handleTicketProcess}>Process</button>{" "}
        <button onClick={handleClearInput}>Clear</button>
        <div className="counters">{showCounters}</div>
        <div>
          {assignedCounter !== null && assignedCounter !== undefined && (
            <p>You are assigned to counter: {assignedCounter}</p>
          )}
          {assignedCounter === undefined && (
            <p>Enter the number of tickets you want</p>
          )}
          {assignedCounter === null && <p>Your tickets have been processed</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
