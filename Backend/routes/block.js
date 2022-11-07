const router = require("express").Router();
const {
    getBlockHeight,
    getBlockInfoFromHeight,
    getBlocksInfoFromMinHeightToMaxHeight
} = require("../controllers/block");


router.get('/', getBlockInfoFromHeight);
router.get('/blockHeight', getBlockHeight);
router.get('/blocks', getBlocksInfoFromMinHeightToMaxHeight);





module.exports = router;