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
  team: Team;
  changeTeam(team: Team): void;
}

export function TeamList({ team, changeTeam }: TeamListProps) {
  return (
    <>
      {teams.map((t) => (
        <TeamLink key={t.name} active={t.name === team.name} onClick={() => changeTeam(t)}>
          <TeamAvatar src={t.avatar} alt={t.name} />
        </TeamLink>
      ))}
    </>
  );
}
