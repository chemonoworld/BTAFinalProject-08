const axios = require("axios");
const { Block, Transaction } = require("../models");
const env = process.env;
const { getData } = require("../modules/utils");

module.exports = {
    getDashboardData: async (req, res) => {
        try {
            const height = await Block.max("height");
            const transactions = await Transaction.count();
            const bondedTokens = (await axios.get(env.LCD_END_POINT + "staking/pool")).data.result.bonded_tokens;
            const communityPool = (await axios.get(env.LCD_END_POINT + "cosmos/distribution/v1beta1/community_pool")).data.pool[0].amount.split(".")[0];
            res.status(200).json({
                height,
                transactions,
                bondedTokens,
                communityPool,
                votingPeriod: "TBD"
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
}