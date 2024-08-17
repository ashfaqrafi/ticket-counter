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

  const [counters, setCounters] = useState([[], [], [], [], []]); // Each sub-array represents a counter's queue
  const [ticketInput, setTicketInput] = useState("");
  const [assignedCounter, setAssignedCounter] = useState();
  let ticketNumber = 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prevCounters) =>
        prevCounters.map((queue) => queue.slice(1))
      );
    }, 1000); // Decrement counters every second

    // Check if the assigned counter is done
    if (assignedCounter && counters[assignedCounter - 1].length === 0) {
      setAssignedCounter(null);
      // Introduce a slight delay before clearing assignedCounter
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
      const leastBusyCounterIndex = counters.reduce(
        (leastBusyIndex, queue, index) =>
          queue.length < counters[leastBusyIndex].length
            ? index
            : leastBusyIndex,
        0
      );
      setCounters((prevCounters) => {
        const newCounters = [...prevCounters];
        const newTickets = Array.from(
          { length: numTickets },
          () => ticketNumber++
        ); // Create an array of unique ticket numbers
        newCounters[leastBusyCounterIndex] = [
          ...newCounters[leastBusyCounterIndex],
          ...newTickets,
        ];
        return newCounters;
      });
      setAssignedCounter(leastBusyCounterIndex + 1);
    }
  };

  const handleTicketInputChange = (e) => {
    setTicketInput(e.target.value);
  };

  const handleClearInput = () => {
    setTicketInput("");
  };

  const showCounters = counters.map((count, index) => (
    <div key={`counter-${index}-${count}`} className="counter">
      <h3>Counter {index + 1}</h3>
      {count.length > 0 && <p>Tickets in Queue: {`${count}, `}</p>}
    </div>
  ));

  return (
    <div className="App">
      <div>
        <label htmlFor="username">Enter your Github username: </label>
        <input
          type="text"
          id="username"
          onChange={handleInputChange}
          value={username}
        />{" "}
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
