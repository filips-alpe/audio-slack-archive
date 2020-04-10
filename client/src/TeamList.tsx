import React from 'react';
import styled from '@emotion/styled/macro';
import { teams, Team } from './data';

const TeamLink = styled.button<{ active: boolean }>`
  width: calc(100% - 10px);
  height: 90px;
  max-height: calc(20vw - 10px);
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  background: ${({ active }) => (active ? '#909090' : '#676767')};
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
        <TeamLink key={t.name} active={t.name === activeTeam.name} onClick={() => setActiveTeam(t)}>
          <TeamAvatar src={t.avatar} alt={t.name} />
        </TeamLink>
      ))}
    </>
  );
}
