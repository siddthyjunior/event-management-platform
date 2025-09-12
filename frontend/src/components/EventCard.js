// frontend/src/components/EventCard.js
import React, { useState } from 'react';
import axios from 'axios';
import TeamList from './TeamList';

export default function EventCard({ event, onRegistered }) {
  const [teams, setTeams] = useState([]);

  const handleRegister = async () => {
    const name = prompt("Your name (optional)");
    const email = prompt("Your email (required)");
    if (!email) {
      alert("Email is required to register.");
      return;
    }
    const skills = prompt("Skills (comma-separated, e.g. python,react)");

    try {
      await axios.post(`http://127.0.0.1:8000/api/events/${event.id}/register/`, {
        username: name,
        email,
        skills
      });
      alert("Registered successfully ✅");
      if (onRegistered) onRegistered();
    } catch (err) {
      console.error(err);
      alert("Registration failed. Check console for error.");
    }
  };

  const handleGenerateTeams = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/events/${event.id}/recommendations/`);
      setTeams(res.data.teams);
    } catch (err) {
      console.error(err);
      alert("Failed to get teams");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{event.title}</h5>
      <p>{event.description}</p>
      <p><small>{new Date(event.date).toLocaleString()}</small></p>
      <button className="btn btn-primary" onClick={handleRegister}>Register</button>
      <button className="btn btn-secondary ms-2" onClick={handleGenerateTeams}>Generate Teams</button>

      <TeamList teams={teams} />
    </div>
  );
}
