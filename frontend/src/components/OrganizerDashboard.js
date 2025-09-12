import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrganizerDashboard({ eventId }) {
  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);

  // Fetch registrations
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/events/${eventId}/registrations/`)
      .then((res) => setRegistrations(res.data))
      .catch((err) => console.error("Error fetching registrations:", err));
  }, [eventId]);

  // Handle team generation
  const handleGenerateTeams = () => {
    axios
      .get(`http://127.0.0.1:8000/api/events/${eventId}/teams/`)
      .then((res) => setTeams(res.data.teams))
      .catch((err) => console.error("Error generating teams:", err));
  };

  return (
    <div>
      <h2>Organizer Dashboard</h2>
      <h3>Registrations for Event {eventId}</h3>
      <ul>
        {registrations.map((reg) => (
          <li key={reg.id}>
            {reg.user} ({reg.email}) — {reg.skills}
          </li>
        ))}
      </ul>

      <button onClick={handleGenerateTeams}>Generate Teams</button>

      {teams.length > 0 && (
        <div>
          <h3>Generated Teams</h3>
          <ul>
            {teams.map((team, i) => (
              <li key={i}>Team {i + 1}: {team.join(", ")}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
