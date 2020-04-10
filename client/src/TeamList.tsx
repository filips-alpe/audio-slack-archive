import React from 'react';
import styled from '@emotion/styled/macro';
import { teams, Team } from './data';

const TeamLink = styled.button<{ active: boolean }>`
  width: 100%;
  height: 100px;
  max-height: 20vw;
  padding: 10px;
  border: none;
  outline: none;
  cursor: pointer;
  background: ${({ active }) => (active ? '#909090' : 'transparent')};
  &:hover {
    background: #a2a2a2;
  }
`;

const TeamAvatar = styled.img`
  max-width: 100%;
`;

interface TeamListProps {
  activeTeam: Team;
  setActiveTeam(team: Team): void;
}

export function TeamList({ activeTeam, setActiveTeam }: TeamListProps) {
  return (
    <>
      {teams.map((t) => (
        <TeamLink active={t.name === activeTeam.name} onClick={() => setActiveTeam(t)}>
          <TeamAvatar src={t.avatar} alt={t.name} />
        </TeamLink>
      ))}
    </>
  );
}
