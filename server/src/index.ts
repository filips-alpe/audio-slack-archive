import {PeerServer} from "peer";

const peerServer = PeerServer({port: 9000, allow_discovery: true});

peerServer.on('connection', conn => console.log(`connected ${conn.getId()}`));
peerServer.on('disconnect', conn => console.log(`disconnect ${conn.getId()}`));
console.log('Peer Server listening on port 9000');

