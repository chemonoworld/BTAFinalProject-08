import WebSocket, { WebSocketServer } from 'ws';
import { osmosis } from 'osmojs';
import blockExample from "./blockExample.json" assert {type: 'json'};
import blockExampleNoSub from "./blockExNoSub.json" assert {type: 'json'};
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";

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

const txQuery = {
    jsonrpc: "2.0",
    method: "subscribe",
    id: 0,
    params: {
        query: "tm.event='Tx'"
    }
}

const blockReq = JSON.stringify(blockQuery);
const txReq = JSON.stringify(txQuery);

const ws = new WebSocket('ws://13.56.212.121:26657/websocket');
ws.on('open', function open() {
    ws.send(blockReq);
});

ws.on('message', function message(data) {
    console.log("New Blocks");
    console.log('%s', getTxsFromBlockFromSub(data));
    // console.log('%s', data);
});

const app = express();
const PORT = process.env.PORT || 3000;


// api 통신을 위한 모듈 설정
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// cors 에러를 잡아주기 위한 설정 -> 여기서는 로컬의 3000번 포트에대한 접근을 허용함
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.listen(PORT, async () => {
    console.log(`      🚀 HTTP Server is starting on ${PORT}`);
    const res = await axios.get("http://13.56.212.121:26657/block?height=17029");
    // const data = JSON.stringify(res.data);
    // console.log(parseBlock(data));
});

const parseBlock = (data) => {
    const blockInfo = JSON.parse(data);
    if (!blockInfo.result) return {};
    const {result: {block: {header: {chain_id: chainId, height, time, last_block_id: {hash}, proposer_address: proposerAddress}, data: {txs}, last_commit: {round}}}} = blockInfo;
    const res = {
        chainId,
        height,
        time,
        hash,
        numOfTx: txs.length,
        round,
        proposerAddress,
        txs
    }
    return res;
}

const parseBlockFromSub = (data) => {
    const blockInfo = JSON.parse(data);
    if (!blockInfo.result.data) return {};
    const { result: { data: { value: { block: { header: { chain_id: chainId, height, time, proposer_address: proposerAddress, last_block_id: { hash } }, data: { txs }, last_commit: { round } } } } } } = blockInfo;
    const res = {
        chainId,
        height,
        time,
        hash,
        numOfTx: txs.length,
        round,
        proposerAddress,
        txs
    }
    return res;
}

const getTxsFromBlockFromSub = (data) => {
    const blockInfo = JSON.parse(data);
    if (!blockInfo.result.data) return {};
    const { result: { data: { value: { block: {data: { txs }} } } } } = blockInfo;
    return txs;
}
