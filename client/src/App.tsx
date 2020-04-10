import React from 'react';
import styled from '@emotion/styled/macro';
import { teams, Team } from './data';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
`;

document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
});

const Sidebar = styled.aside`
  width: 100px;
  max-width: 20vw;
  background: #b2b2b2;
`;

const Content = styled.main`
  flex: 1;
  background: #2b2b2b;
`;

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

function App() {
  const [team, setActiveTeam] = React.useState<Team>(teams[0]);
  return (
    <AppContainer>
      <Sidebar>
        <TeamList activeTeam={team} setActiveTeam={setActiveTeam} />
      </Sidebar>
      <Content>This team has {team.users.length} users</Content>
    </AppContainer>
  );
}

interface TeamListProps {
  activeTeam: Team;
  setActiveTeam(team: Team): void;
}

function TeamList({ activeTeam, setActiveTeam }: TeamListProps) {
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

export default App;
