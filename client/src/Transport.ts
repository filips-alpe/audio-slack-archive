import Peer, {DataConnection, MediaConnection} from 'peerjs';
import {UserStatus} from "./data";

const HOST = '46.101.239.193';
const PORT = 9000;

type Status = { status: UserStatus }

type MessageType = { type: 'call' | 'status' }
type CallMessage = { callId: string } & MessageType
type StatusMessage = Status & MessageType

class Transport {
	peerApp = new Peer({host: HOST, port: PORT});
	peers: { [key: string]: { conn?: DataConnection } & Status } = {};
	talk: { [key: string]: MediaConnection } = {};
	status = UserStatus.AVAILABLE;
	isPrivateTalk = false;

	id?: string;
	stream?: MediaStream;

	onConnect: (id: string) => void;
	onDisconnect: () => void;
	onBusy: (id: string) => void;

	constructor(
		onConnect: (id: string) => void,
		onDisconnect: () => void,
		onBusy: (id: string) => void,
	) {
		this.onConnect = onConnect;
		this.onDisconnect = onDisconnect;
		this.onBusy = onBusy;
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
				peer.conn.send({type: 'status', status: this.status})
			}
		}
	}

	private onPeerOpen(id: string) {
		this.initStream();
		this.id = id;
		this.peerApp.listAllPeers(this.initPeers);
	}

	private onPeerConnection(conn: DataConnection) {
		this.peers[conn.peer] = {conn, status: UserStatus.AVAILABLE};
		conn.send({type: 'status', status: this.status});
		this.setConnection(conn);
	}

	private initPeers(ids: string[]) {
		ids.forEach(id => this.setConnection(this.peerApp.connect(id)));
	}

	private setConnection(conn: DataConnection) {
		conn.on('close', () => {
			const peer = this.peers[conn.peer];
			peer.conn = undefined;
			peer.status = UserStatus.UNAVAILABLE;
		});
		//TODO need pattern matching
		conn.on('data', (data: MessageType) => {
			switch (data.type) {
				case "status":
					if (!(conn.peer in this.talk)) {
						this.peers[conn.peer].status = (<StatusMessage>data).status;
						this.onConnect(conn.peer);
					}
					break;
				case "call":
					this.call((<CallMessage>data).callId, false);
					break;
			}
		});
	}

	private setCall(call: MediaConnection) {
		call.on('stream', remoteStream => {
			this.talk[call.peer] = call;
			if (this.status !== UserStatus.CONNECTED) {
				this.setStatus(UserStatus.CONNECTED);
			}
			this.onConnect(call.peer);
			//	TODO create audio tag and link it to remote stream
		});
		call.on('close', () => {
			//	TODO remove audio tag
			delete this.talk[call.peer];
			if (!Object.keys(this.talk).length) {
				this.setStatus(UserStatus.AVAILABLE);
				this.onDisconnect();
			}
		});
	}

	private async initStream() {
		this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
	}

	private askToCall(id: string) {
		for (let conn of Object.values(this.talk)) {
			const peer = this.peers[conn.peer];
			if (peer.conn) {
				peer.conn.send({type: 'call', call: id})
			}
		}
	}

	private onCall(call: MediaConnection) {
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
	}
}
