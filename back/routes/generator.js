const express = require("express");
const { generateApi } = require("../controllers/GeneratorController.js");

const router = express.Router();
router.get('/:table', generateApi);
module.exports = router;
