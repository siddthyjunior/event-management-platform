import React from "react";

export default function TeamList({ teams }) {
  if (!teams || teams.length === 0) {
    return <p>No teams generated yet.</p>;
  }

  return (
    <div className="mt-3">
      <h6>Generated Teams</h6>
      {teams.map((team, idx) => (
        <div key={idx} className="card p-2 mb-2">
          <strong>Team {idx + 1}</strong>
          <ul>
            {team.map((member, i) => (
              <li key={i}>{member}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
