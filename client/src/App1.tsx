import React, {Component} from 'react';
import styled from '@emotion/styled/macro';
import {TeamList} from './TeamList';
import {Team, teams, User, UserStatus} from './data';
import {getTransport} from './Transport';

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
  filter: ${({status}) => status === UserStatus.UNAVAILABLE && 'blur(5px)'};
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
  cursor: pointer;
  @media screen and (min-width: 767px) {
    & > div {
      display: none;
      font-size: 1.3em;
    }
    &:hover > div {
      display: flex;
    }
  }
`;

const UserAvatar = styled.img<{ status: UserStatus }>`
  width: 100%;
  height: 100%;
  border: 5px solid
    ${({status}) =>
	status === UserStatus.CONNECTED
		? 'rgba(33, 150, 243, 0.7)'
		: status === UserStatus.AVAILABLE
		? 'rgba(53, 236, 60, 0.7)'
		: 'rgba(208, 25, 25, 0.7)'};
  border-radius: 15px;
  box-sizing: border-box;
`;

const UserNameContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 15px;
  line-height: 1em;
  font-size: 0.9em;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
`;

const UserName = styled.div`
  width: 100%;
  padding-bottom: 15px;
  align-self: flex-end;
  text-align: center;
  font-weight: bold;
  color: white;
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
		<UserNameContainer>
			<UserName>{user.name}</UserName>
		</UserNameContainer>
		<UserAvatar src={user.avatar} alt={user.name} title={user.name} status={status}/>
	</UserCard>)
;

const transport = getTransport({
	onPeersChanged: () => console.log(`peers just changed`),
	onBusy: (id) => console.log(`peer ${id} calling, but i am busy`),
});

type AppState = { team: Team, muted: boolean }

class App extends Component<{}, AppState> {
	state = {
		team: teams[0],
		muted: false,
	};

	rerender = () => {
		this.setState({});
	};

	componentDidMount(): void {
		transport.onPeersChanged = this.rerender;
	}

	setStatus = (status: UserStatus) => {
		transport.setStatus(status);
		this.forceUpdate();
	};

	getStatus = (user: User) => {
		if (transport.peers[user.id]) {
			return transport.peers[user.id].status;
		}
		if (user.id === transport.myId) {
			return transport.status;
		}
		return UserStatus.UNAVAILABLE;
	};

	sortByStatus = (users: User[]) => {
		return users.sort((a, b) => {
			if (a.id === transport.myId) {
				return -1;
			}
			if (b.id === transport.myId) {
				return 1;
			}
			return this.getStatus(a) - this.getStatus(b);
		});
	};

	userCards = ()=> this.sortByStatus(this.state.team.users).map(u =>
		renderUserCard(u, this.getStatus(u), () => transport.call(u.id)),
	);

	render() {
		return (
			<AppContainer>
				<Sidebar>
					<TeamList
						team={this.state.team}
						changeTeam={team => {
							if (transport.status === UserStatus.CONNECTED) {
								transport.hangUp();
							}
							this.setState({team});
						}}
					/>
				</Sidebar>
				<Content status={transport.status}>
					<UserContainer>
						{this.userCards()}
					</UserContainer>
				</Content>
				<ControlButtons
					status={transport.status}
					setStatus={this.setStatus}
					muted={this.state.muted}
					setMuted={() => this.setState({muted: !this.state.muted})}
					onHangUp={transport.hangUp}
				/>
			</AppContainer>
		)
	};
}

interface ControlButtonsProps {
	status: UserStatus;

	setStatus(status: UserStatus): void;

	muted: boolean;

	setMuted(muted: boolean): void;

	onHangUp(): void;
}

const ControlButtons = ({status, setStatus, muted, setMuted, onHangUp}: ControlButtonsProps) => {
	return (
		<ControlButtonContainer>
			{status === UserStatus.CONNECTED && (
				<RedButton onClick={() => {
					onHangUp();
					setStatus(UserStatus.AVAILABLE);
				}}
				>
					HANG UP
				</RedButton>
			)}
			{status === UserStatus.CONNECTED &&
			(muted ? (
				<GreenButton
					onClick={() => {
						setMuted(false);
					}}
				>
					UNMUTE
				</GreenButton>
			) : (
				<RedButton
					onClick={() => {
						setMuted(true);
					}}
				>
					MUTE
				</RedButton>
			))}
			{status === UserStatus.UNAVAILABLE && (
				<GreenButton onClick={() => setStatus(UserStatus.AVAILABLE)}>JOIN</GreenButton>
			)}
			{status === UserStatus.AVAILABLE && (
				<RedButton
					onClick={() => {
						onHangUp();
						setStatus(UserStatus.UNAVAILABLE);
					}}
				>
					LEAVE
				</RedButton>
			)}
		</ControlButtonContainer>
	);
};

export default App;
