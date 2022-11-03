// const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import ws from "ws";
import { MongoClient } from "mongodb";

const URL_FOR_CONNECTION = "mongodb+srv://jinwoo:qwe123@cluster0.fzkvv.mongodb.net/bta-osmo-explorer?retryWrites=true&w=majority"
// MongoClient.connect(URL_FOR_CONNECTION);

const client = new MongoClient(URL_FOR_CONNECTION);
const db = client.db("bta-osmo-explorer");
const BLOCKS = db.collection('BLOCK_INFO');
const TXS = db.collection('TX_INFO');
const mongoRun = async() => {
    try {
        const doc = {
            block: "block입니당",
            txs: [1,2,3,4]
        }
        BLOCKS.insertOne(doc);
    } catch (error) {
        
    }
}

const app = express();
const PORT = process.env.PORT || 3000;


// api 통신을 위한 모듈 설정
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// cors 에러를 잡아주기 위한 설정 -> 여기서는 로컬의 3000번 포트에대한 접근을 허용함
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.listen(PORT, async () => {
    mongoRun();
    console.log(`      🚀 HTTP Server is starting on ${PORT}`);
});