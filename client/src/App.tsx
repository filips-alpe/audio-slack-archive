import React from 'react';
import styled from '@emotion/styled/macro';
import { TeamList } from './TeamList';
import { teams, Team, User } from './data';

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
  padding: 20px;
  overflow: scroll;
`;

const UserContainer = styled.div`
  display: grid;

  @media only screen and (max-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (min-width: 801px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media only screen and (min-width: 1001px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media only screen and (min-width: 1201px) {
    grid-template-columns: repeat(6, 1fr);
  }
  grid-gap: 10px;
`;

const UserCard = styled.div`
  width: 100%;
`;

const UserAvatar = styled.img`
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-sizing: border-box;
`;

const renderUserCard = (user: User) => (
  <UserCard>
    <UserAvatar src={user.avatar} alt={user.name} />
  </UserCard>
);

function App() {
  const [team, setActiveTeam] = React.useState<Team>(teams[0]);
  return (
    <AppContainer>
      <Sidebar>
        <TeamList activeTeam={team} setActiveTeam={setActiveTeam} />
      </Sidebar>
      <Content>
        <UserContainer>{team.users.map(renderUserCard)}</UserContainer>
      </Content>
    </AppContainer>
  );
}

export default App;
