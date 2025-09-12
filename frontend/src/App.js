// frontend/src/App.js
import axios from "axios";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import EventCard from "./components/EventCard";
import OrganizerDashboard from "./components/OrganizerDashboard";


const token = localStorage.getItem("access");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      axios.get("http://127.0.0.1:8000/api/events/")
        .then(res => setEvents(res.data))
        .catch(err => console.error("Error fetching events:", err));
    }
  }, [loggedIn]);

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>Event Management Platform</h1>
          {selectedEvent ? (
            <OrganizerDashboard eventId={selectedEvent.id} />
          ) : (
            <div>
              <h2>Select an Event</h2>
              <ul>
                {events.map(event => (
                  <li key={event.id}>
                    <button onClick={() => setSelectedEvent(event)}>
                      {event.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;