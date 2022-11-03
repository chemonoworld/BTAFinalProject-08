import WebSocket, { WebSocketServer } from 'ws';
import { osmosis } from 'osmojs';

// const RPC_ENDPOINT = "ws://13.56.212.121:26657/websocket";
// const { createRPCQueryClient } = osmosis.ClientFactory;
// const client = await createRPCQueryClient({ rpcEndpoint: RPC_ENDPOINT });


const blockQuery = {
    jsonrpc: "2.0",
    method: "subscribe",
    id: 0,
    params: {
        query: "tm.event='NewBlock'"
    }
}

const blockReq = JSON.stringify(blockQuery);

const txQuery = {
    jsonrpc: "2.0",
    method: "subscribe",
    id: 0,
    params: {
        query: "tm.event='Tx'"
    }
}

const txReq = JSON.stringify(txQuery);

const ws = new WebSocket('ws://13.56.212.121:26657/websocket');


ws.on('open', function open() {
    ws.send(txReq);
});

// ws.on('message', function message(data) {
//     console.log("New Block");
//     console.log('%s', data);
// });

ws.on('message', function message(data) {
    console.log("New Tx");
    console.log('%s', data);
});
