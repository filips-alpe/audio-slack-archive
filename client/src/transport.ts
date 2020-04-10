import Peer from 'peerjs';

const PERSON_ID_1 = 'person_id_1';

const PERSON_ID_2 = 'person_id_2';


export function init() {
	const peer = new Peer(PERSON_ID_1);

	function call(personId: string) {
		navigator.mediaDevices.getUserMedia({audio: true})
		.then((stream) => {
			const call = peer.call(personId, stream);
			call.on('stream', (remoteStream) => {
				debugger;
				console.log('connected initiated')
			});
		}, (err) => {
			console.error('Failed to get local stream', err);
		});
	}

	peer.on('call', (call) => {
		debugger;
		navigator.mediaDevices.getUserMedia({audio: true})
		.then((stream) => {
			debugger;
			call.answer(stream); // Answer the call with an A/V stream.
			call.on('stream', (remoteStream) => {
				debugger;
				console.log('connected received')
			});
		}, (err) => {
			console.error('Failed to get local stream', err);
		});
	});

	call(PERSON_ID_2);
}
