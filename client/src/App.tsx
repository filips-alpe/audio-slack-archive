import React from 'react';
import styled from '@emotion/styled/macro';
import { TeamList } from './TeamList';
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

export default App;
