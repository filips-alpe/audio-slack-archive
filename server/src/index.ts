import {PeerServer} from "peer";
import {readFileSync} from "fs";

const ids: Set<string> = new Set();
const skipedIds: string[] = [];
let lastId: number = 0;
const nextId: () => string = () => {
	if (skipedIds.length) {
		let id = skipedIds.pop() || '0';
		ids.add(id);
		return id;
	}
	const id = String(++lastId);
	ids.add(id);
	return id;
};
const peerServer = PeerServer({
	port: 9000,
	allow_discovery: true,
	generateClientId: nextId,
	ssl: {
		key: readFileSync('privkey.pem').toString(),
		cert: readFileSync('fullchain.pem').toString()
	}
});

peerServer.on('connection', conn => console.log(`connected ${conn.getId()}`));
peerServer.on('disconnect', conn => {
	const id = conn.getId();
	console.log(`disconnect ${id}`);
	if (ids.has(id)) {
		ids.delete(id);
		skipedIds.push(id);
	}
});
console.log('Peer Server listening on port 9000');

