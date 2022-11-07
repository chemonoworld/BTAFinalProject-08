const {osmosis, getSigningOsmosisClient, cosmos} = require("osmojs");
const {SigningStargateClient, StargateClient} = require('@cosmjs/stargate');
const env = process.env;
const {Block} = require("../models");
const {extractBlockInfo, extractBlocksInfoFromMinHeightToMaxHeight , extractFullBlocksInfoFromMinHeightToMaxHeight}= require('../modules/parseBlockInfo');
const axios = require("axios");


const endPoint = env.END_POINT // 노드 주소

// const {createRPCQueryClient} = osmosis.ClientFactory;
// await createRPCQueryClient({rpcEndpoint: endPoint})
// await StargateClient.connect(endPoint)

module.exports = {
    getBlockHeight: async (req, res) => { // 블록 높이 리턴
        try {
            const signingClient = await SigningStargateClient.connect(endPoint);
            const height_signing = await signingClient.getHeight();
            res.status(200).json(height_signing);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    },

    getBlockInfoFromHeight: async (req, res) => { //  해당 height 의 블록 정보 리턴
        try {
            const height = Number(req.query.height);
            // console.log(typeof height);
            const block = await axios.get(process.env.END_POINT + "block?height=" + height);
            const extractedBlock = await extractBlockInfo(block.data);
            if (!extractedBlock) "Parsed block is null!";
            // console.log(parsedBlock);
            // const block_signing = await signingClient.getBlock(height);
            res.status(200).json(extractedBlock);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    },

    getBlocksInfoFromMinHeightToMaxHeight: async (req, res) => {// from min to max
        try {
            const minHeight = Number(req.query.minHeight);
            const maxHeight = Number(req.query.maxHeight);
            // console.log(typeof height);
            const extractedBlocks = await extractFullBlocksInfoFromMinHeightToMaxHeight(minHeight, maxHeight)
            if (!extractedBlocks) "Parsed block is null!";
            console.log(extractedBlocks);
            res.status(200).json(extractedBlocks);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }
}

