import Peer, {DataConnection, MediaConnection} from 'peerjs';
import {UserStatus} from './data';

const HOST = 'emergency.walmoo.com';
const PORT = 9000;
const CONFIG = {
	iceServers: [
		{urls: 'stun:stun.l.google.com:19302'},
		{
			urls: 'turn:ec2-35-156-252-206.eu-central-1.compute.amazonaws.com:3478',
			username: 'test',
			credential: 'test'
		}
	]
};


type Status = { status: UserStatus };

type MessageType = { type: 'call' | 'status' };
type CallMessage = { callId: string } & MessageType;
type StatusMessage = Status & MessageType;

export type Peers = { [key: string]: { conn?: DataConnection } & Status };

export interface TransportOptions {
	onPeersChanged: () => void;
	onBusy: (id: string) => void;
}

class Transport {
	public peers: Peers = {};
	public isPrivateTalk = false;

	peerApp = new Peer({host: HOST, port: PORT, secure: true, config: CONFIG});
	talk: { [key: string]: MediaConnection } = {};
	status = UserStatus.AVAILABLE;
	stream: MediaStream = new MediaStream();
	myId: string = '-1';

	onPeersChanged: () => void;
	onBusy: (id: string) => void;

	constructor(options: TransportOptions) {
		this.onPeersChanged = options.onPeersChanged;
		this.onBusy = options.onBusy;
		this.peerApp.on('open', this.onPeerOpen);
		this.peerApp.on('connection', this.onPeerConnection);
		this.peerApp.on('call', this.onCall);
	}

	public call(id: string, join = true) {
		if (this.myId !== id) {
			this.setCall(this.peerApp.call(id, this.stream));
			if (join) {
				this.askToCall(id);
			}
		}
	}

	public hangUp = () => {
		const nextPeerStatus = Object.keys(this.talk).length === 1 ? UserStatus.AVAILABLE : UserStatus.UNAVAILABLE;
		for (let conn of Object.values(this.talk)) {
			this.peers[conn.peer].status = nextPeerStatus;
			delete this.talk[conn.peer];
			conn.close();
		}
	};

	public setStatus(status: UserStatus) {
		this.status = status;
		for (let peer of Object.values(this.peers)) {
			if (peer.conn) {
				peer.conn.send({type: 'status', status: this.status});
			}
		}
	}

	private onPeerOpen = (myId: string) => {
		this.initStream();
		this.myId = myId;
		this.peerApp.listAllPeers((ids) =>
			ids
			.filter((id) => id !== myId)
			.forEach((id) => {
				const conn = this.peerApp.connect(id);
				conn.on('open', () => this.setConnection(conn));
				this.peers[id] = {conn, status: UserStatus.UNAVAILABLE};
			}),
		);
		console.log(`onPeerOpen ${myId}`);
		this.onPeersChanged();
	};

	private onPeerConnection = (conn: DataConnection) => {
		this.peers[conn.peer] = {conn, status: UserStatus.AVAILABLE};
		conn.on('open', () => {
			this.setConnection(conn);
			conn.send({type: 'status', status: this.status});
		});
	};

	private setConnection = (conn: DataConnection) => {
		this.onPeersChanged();
		conn.on('close', () => {
			const peer = this.peers[conn.peer];
			peer.conn = undefined;
			peer.status = UserStatus.UNAVAILABLE;
			this.onPeersChanged();
		});
		//TODO need pattern matching
		conn.on('data', (data: MessageType) => {
			switch (data.type) {
				case 'status':
					if (!(conn.peer in this.talk)) {
						let status = (data as StatusMessage).status;
						if (status === UserStatus.CONNECTED) {
							status = UserStatus.UNAVAILABLE;
						}
						this.peers[conn.peer].status = status;
					}
					this.onPeersChanged();
					break;
				case 'call':
					this.call((data as CallMessage).callId, false);
					break;
			}
		});
	};

	private setCall = (call: MediaConnection) => {
		call.on('stream', (remoteStream) => {
			this.talk[call.peer] = call;
			this.peers[call.peer].status = UserStatus.CONNECTED;
			if (this.status !== UserStatus.CONNECTED) {
				this.setStatus(UserStatus.CONNECTED);
			}
			this.onPeersChanged();
			const audio = addAudioStream(remoteStream);
			call.on('close', () => {
				if (call.peer in this.talk) {
					delete this.talk[call.peer];
					this.peers[call.peer].status = UserStatus.AVAILABLE;
				}
				if (!Object.keys(this.talk).length) {
					this.setStatus(UserStatus.AVAILABLE);
				}
				this.onPeersChanged();
				audio.remove();
			});
		});
	};

	private async initStream() {
		this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
	}

	private askToCall = (id: string) => {
		for (let conn of Object.values(this.talk)) {
			const peer = this.peers[conn.peer];
			if (peer.conn) {
				peer.conn.send({type: 'call', callId: id});
			}
		}
	};

	private onCall = (call: MediaConnection) => {
		//TODO if joining other conversation must join all peers. must figure out who is in that talk
		// if (this.status === UserStatus.CONNECTED || this.status === UserStatus.UNAVAILABLE) {
		if (this.status === UserStatus.UNAVAILABLE) {
			this.onBusy(call.peer);
			return;
		}
		call.answer(this.stream);
		this.setCall(call);
	};
}

const addAudioStream = (stream: MediaStream) => {
	const audio = document.createElement('audio');
	audio.id = stream.id;
	audio.setAttribute('autoplay', 'autoplay');
	audio.setAttribute('preload', 'auto');
	audio.srcObject = stream;
	return audio;
};

let transport: Transport;
export const getTransport = (options: TransportOptions) => {
	if (!transport) {
		transport = new Transport(options);
	}
	return transport;
};
