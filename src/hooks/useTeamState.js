import { useState, useEffect } from 'react';

const TEAM_STATE_KEY = 'planning-room.team-state';

/**
 * Team state structure:
 * {
 *   mode: "solo" | "team",
 *   teamId?: string,
 *   teamName?: string,
 *   members?: string[]  // optional, can be local placeholder
 * }
 */

const INITIAL_TEAM_STATE = {
  mode: 'solo'
};

/**
 * Custom hook for team state management
 * @returns {Object} - { teamState, createTeam, joinTeam, leaveTeam, updateTeamName }
 */
export function useTeamState() {
  const [teamState, setTeamStateState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(TEAM_STATE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return INITIAL_TEAM_STATE;
    } catch (error) {
      console.error('Error reading team state from localStorage:', error);
      return INITIAL_TEAM_STATE;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(TEAM_STATE_KEY, JSON.stringify(teamState));
    } catch (error) {
      console.error('Error setting team state in localStorage:', error);
    }
  }, [teamState]);

  const createTeam = (teamName) => {
    // Generate a short team ID (8 characters)
    const teamId = Math.random().toString(36).substring(2, 10);
    const newState = {
      mode: 'team',
      teamId,
      teamName,
      members: [] // placeholder for future
    };
    setTeamStateState(newState);
    return teamId;
  };

  const joinTeam = (teamId, teamName) => {
    const newState = {
      mode: 'team',
      teamId,
      teamName: teamName || `Team ${teamId.substring(0, 4)}`,
      members: [] // placeholder for future
    };
    setTeamStateState(newState);
  };

  const leaveTeam = () => {
    setTeamStateState(INITIAL_TEAM_STATE);
  };

  const updateTeamName = (teamName) => {
    if (teamState.mode === 'team') {
      setTeamStateState(prev => ({ ...prev, teamName }));
    }
  };

  return {
    teamState,
    createTeam,
    joinTeam,
    leaveTeam,
    updateTeamName
  };
}

