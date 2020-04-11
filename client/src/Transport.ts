import Peer, {DataConnection, MediaConnection} from 'peerjs';
import {UserStatus} from './data';

const HOST = 'emergency.walmoo.com';
const PORT = 9000;

type Status = { status: UserStatus };

type MessageType = { type: 'call' | 'status' };
type CallMessage = { callId: string } & MessageType;
type StatusMessage = Status & MessageType;

export type Peers = { [key: string]: { conn?: DataConnection } & Status };

export interface TransportOptions {
	onPeersChanged: (peers: Peers) => void;
	onBusy: (id: string) => void;
	renderAudioStream: (stream: MediaStream) => () => void;
}

export class Transport {
	peerApp = new Peer({host: HOST, port: PORT, secure: true});
	public peers: Peers = {};
	talk: { [key: string]: MediaConnection } = {};
	status = UserStatus.AVAILABLE;
	private renderAudioStream: (stream: MediaStream) => () => void;
	public isPrivateTalk = false;

	stream?: MediaStream;

	onPeersChanged: (peers: Peers) => void;
	onBusy: (id: string) => void;

	constructor(options: TransportOptions) {
		this.onPeersChanged = options.onPeersChanged;
		this.onBusy = options.onBusy;
		this.renderAudioStream = options.renderAudioStream;
		this.peerApp.on('open', this.onPeerOpen);
		this.peerApp.on('connection', this.onPeerConnection);
		this.peerApp.on('call', this.onCall);
	}

	public call(id: string, join = true) {
		if (this.stream) {
			this.setCall(this.peerApp.call(id, this.stream));
			if (join) {
				this.askToCall(id);
			}
		}
	}

	public hangUp() {
		for (let conn of Object.values(this.talk)) {
			conn.close();
		}
		this.setStatus(UserStatus.AVAILABLE);
	}

	public setStatus(status: UserStatus) {
		this.status = status;
		for (let peer of Object.values(this.peers)) {
			if (peer.conn) {
				peer.conn.send({type: 'status', status: this.status});
			}
		}
	}

	private onPeerOpen = (myId: string) => {
		debugger;
		this.initStream();
		this.peerApp.listAllPeers(ids => ids.filter(id => id !== myId).forEach(
			id => {
				const conn = this.peerApp.connect(id);
				conn.on('open', () => this.setConnection(conn));
				this.peers[id] = {conn, status: UserStatus.UNAVAILABLE};
			}
		));
		console.log(`onPeerOpen ${myId}`);
	};

	private onPeerConnection = (conn: DataConnection) => {
		this.peers[conn.peer] = {conn, status: UserStatus.AVAILABLE};
		debugger;
		conn.on('open', () => {
			this.setConnection(conn);
			conn.send({type: 'status', status: this.status});
		});
	};

	private setConnection = (conn: DataConnection) => {
		conn.on('close', () => {
			debugger;
			const peer = this.peers[conn.peer];
			peer.conn = undefined;
			peer.status = UserStatus.UNAVAILABLE;
		});
		//TODO need pattern matching
		conn.on('data', (data: MessageType) => {
			switch (data.type) {
				case 'status':
					if (!(conn.peer in this.talk)) {
						let nextStatus = (data as StatusMessage).status;
						debugger;
						this.peers[conn.peer].status = nextStatus;
						this.onPeersChanged(this.peers);
					}
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
			if (this.status !== UserStatus.CONNECTED) {
				this.setStatus(UserStatus.CONNECTED);
			}
			this.onPeersChanged(this.peers);
			this.renderAudioStream(remoteStream);
		});
		call.on('close', () => {
			// remove streams
			delete this.talk[call.peer];
			if (!Object.keys(this.talk).length) {
				this.setStatus(UserStatus.AVAILABLE);
				this.onPeersChanged(this.peers);
			}
		});
	};

	private async initStream() {
		this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
	}

	private askToCall = (id: string) => {
		for (let conn of Object.values(this.talk)) {
			const peer = this.peers[conn.peer];
			if (peer.conn) {
				peer.conn.send({type: 'call', call: id});
			}
		}
	};

	private onCall = (call: MediaConnection) => {
		if (
			(this.isPrivateTalk && this.status === UserStatus.CONNECTED) ||
			this.status === UserStatus.UNAVAILABLE ||
			!this.stream
		) {
			this.onBusy(call.peer);
			return;
		}
		call.answer(this.stream);
		this.setCall(call);
	};
}

let transport: Transport;
export const getInstance = (options: TransportOptions) => {
	if (!transport) {
		transport = new Transport(options);
	}
	return transport;
};
