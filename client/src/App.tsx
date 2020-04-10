import React from 'react';
import styled from '@emotion/styled/macro';
import css from '@emotion/css/macro';
import { TeamList } from './TeamList';
import { teams, Team, User, UserStatus } from './data';

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
`;

const Content = styled.main<{ status: UserStatus }>`
  flex: 1;
  background: #2b2b2b;
  padding: 20px 20px 100px 20px;
  overflow: scroll;
  filter: ${({ status }) => status === UserStatus.UNAVAILABLE && 'blur(5px)'};
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

const UserCard = styled.div<{ status: UserStatus }>`
  width: 100%;
  position: relative;
  line-height: 0;
  ${({ status }) =>
    status === UserStatus.AVAILABLE &&
    css`
      cursor: pointer;
    `}
  & > div {
    display: none;
  }
  &:hover > div {
    display: block;
  }
`;

const UserAvatar = styled.img<{ status: UserStatus }>`
  width: 100%;
  height: 100%;
  border: 5px solid
    ${({ status }) =>
      status === UserStatus.CONNECTED
        ? 'rgba(33, 150, 243, 0.7)'
        : status === UserStatus.AVAILABLE
        ? 'rgba(53, 236, 60, 0.7)'
        : 'rgba(208, 25, 25, 0.7)'};
  border-radius: 15px;
  box-sizing: border-box;
`;

const UserName = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  text-align: center;
  font-size: 1.4em;
  font-weight: bold;
  padding-top: 85%;
  border-radius: 15px;
  color: white;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
`;

const ControlButtonContainer = styled.footer`
  position: fixed;
  bottom: 0;
  height: 80px;
  display: flex;
  width: 100vw;
  background: #2b2b2b;
  padding-top: 10px;
`;
const Button = styled.button`
  flex: 1;
  font-size: 2em;
  opacity: 0.8;
  color: white;
  font-weight: bold;
  cursor: pointer;
  outline: none;
`;
const GreenButton = styled(Button)`
  border: 5px solid #16ab39;
  background: rgba(33, 186, 69, 0.2);
  &:hover {
    background: rgba(33, 186, 69, 0.6);
  }
`;
const RedButton = styled(Button)`
  border: 5px solid #d01919;
  background: rgba(208, 25, 25, 0.2);
  &:hover {
    background: rgba(208, 25, 25, 0.6);
  }
`;

const renderUserCard = (user: User, status: UserStatus, onClick?: () => void) => (
  <UserCard key={user.id} onClick={onClick} status={status}>
    <UserName>{user.name}</UserName>
    <UserAvatar src={user.avatar} alt={user.name} title={user.name} status={status} />
  </UserCard>
);

function App() {
  const [team, setActiveTeam] = React.useState<Team>(teams[0]);
  const [status, setStatus] = React.useState<UserStatus>(UserStatus.AVAILABLE);
  const [currentUser, setCurrentUser] = React.useState<User>({
    id: 'yoda',
    name: 'Yoda',
    avatar: 'https://avatarfiles.alphacoders.com/125/125043.jpg',
    online: true,
    connections: [],
  });

  const getStatus = (user: User) => {
    if (currentUser.connections.includes(user.id)) {
      return UserStatus.CONNECTED;
    }
    if (user.online) {
      return UserStatus.AVAILABLE;
    }
    return UserStatus.UNAVAILABLE;
  };

  const sortByStatus = (users: User[]) => users.sort((a, b) => getStatus(a) - getStatus(b));

  return (
    <AppContainer>
      <Sidebar>
        <TeamList activeTeam={team} setActiveTeam={setActiveTeam} />
      </Sidebar>
      <Content status={status}>
        <UserContainer>
          {renderUserCard(currentUser, status)}
          {sortByStatus(team.users).map((u) =>
            renderUserCard(u, getStatus(u), () => {
              const status = getStatus(u);
              if (status === UserStatus.AVAILABLE) {
                setStatus(UserStatus.CONNECTED);
                setCurrentUser({ ...currentUser, connections: [...currentUser.connections.concat(u.id)] });
              }
            }),
          )}
        </UserContainer>
      </Content>
      <ControlButtons
        status={status}
        setStatus={setStatus}
        onHangUp={() => setCurrentUser({ ...currentUser, connections: [] })}
      />
    </AppContainer>
  );
}

interface ControlButtonsProps {
  status: UserStatus;
  setStatus(status: UserStatus): void;
  onHangUp(): void;
}

const ControlButtons = ({ status, setStatus, onHangUp }: ControlButtonsProps) => {
  return (
    <ControlButtonContainer>
      {status === UserStatus.CONNECTED && (
        <RedButton
          onClick={() => {
            onHangUp();
            setStatus(UserStatus.AVAILABLE);
          }}
        >
          HANG UP
        </RedButton>
      )}
      {status === UserStatus.UNAVAILABLE && (
        <GreenButton onClick={() => setStatus(UserStatus.AVAILABLE)}>AVAILABLE</GreenButton>
      )}
      {status !== UserStatus.UNAVAILABLE && (
        <RedButton
          onClick={() => {
            onHangUp();
            setStatus(UserStatus.UNAVAILABLE);
          }}
        >
          AWAY
        </RedButton>
      )}
    </ControlButtonContainer>
  );
};

export default App;
