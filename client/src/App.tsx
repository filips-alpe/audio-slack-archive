import React from 'react';
import styled from '@emotion/styled/macro';

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
  return (
    <AppContainer>
      <Sidebar>
        <Teams />
      </Sidebar>
      <Content></Content>
    </AppContainer>
  );
}

function Teams() {
  const teams = [
    {
      avatar:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_Boring_Company_Logo.svg/200px-The_Boring_Company_Logo.svg.png',
      name: 'The Boring Company',
    },
    {
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/85/3M_CORPORATION.png',
      name: '3M',
    },
    {
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
      name: 'NASA',
    },
  ];
  const [activeTeam, setActiveTeam] = React.useState(teams[0].name);
  return (
    <>
      {teams.map((t) => (
        <TeamLink active={t.name === activeTeam} onClick={() => setActiveTeam(t.name)}>
          <TeamAvatar src={t.avatar} alt={t.name} />
        </TeamLink>
      ))}
    </>
  );
}

export default App;
