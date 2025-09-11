// frontend/src/App.js
import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./components/EventCard";

function App() {
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    axios.get("http://127.0.0.1:8000/api/events/")
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Event Management Platform</h1>
      <div>
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onRegistered={fetchEvents} // refresh events after register
          />
        ))}
      </div>
    </div>
  );
}

export default App;
