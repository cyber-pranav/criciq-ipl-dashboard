import React from 'react';

export default function MatchCard({ match }) {
  const isTeam1Winner = match.winner === match.team1;
  const isTeam2Winner = match.winner === match.team2;

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-surface border border-border rounded-lg">
      {/* Team 1 */}
      <div className="flex-1 text-right">
        <span
          className={`text-sm font-medium ${
            isTeam1Winner ? 'text-text' : 'text-muted'
          }`}
        >
          {match.team1}
        </span>
        {isTeam1Winner && (
          <span className="ml-2 inline-block px-1.5 py-0.5 text-xs bg-cyan text-navy rounded font-semibold">
            W
          </span>
        )}
      </div>

      {/* Score */}
      <div className="text-center shrink-0">
        <div className="text-mono text-xs text-muted">
          {match.score1 && <span>{match.score1}</span>}
        </div>
        <span className="text-muted text-xs">vs</span>
        <div className="text-mono text-xs text-muted">
          {match.score2 && <span>{match.score2}</span>}
        </div>
      </div>

      {/* Team 2 */}
      <div className="flex-1 text-left">
        {isTeam2Winner && (
          <span className="mr-2 inline-block px-1.5 py-0.5 text-xs bg-cyan text-navy rounded font-semibold">
            W
          </span>
        )}
        <span
          className={`text-sm font-medium ${
            isTeam2Winner ? 'text-text' : 'text-muted'
          }`}
        >
          {match.team2}
        </span>
      </div>

      {/* Date */}
      <span className="text-muted text-xs shrink-0">{match.date}</span>
    </div>
  );
}
