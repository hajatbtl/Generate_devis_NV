const express = require('express');
// const bodyParser = require('body-parser');

const router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
const { getAll, getOne, postRow, deleteRow, recoverRow, updateRow, getAllActive, getAllDesactive, getDescribe } = require('../controllers/devisWithPrestationController.js');

router.get("/", getAll);
router.get("/describe", getDescribe);
router.get("/active", getAllActive);
router.get("/desactive", getAllDesactive);
router.get("/:id", getOne);
router.post("/add", postRow);
router.put("/delete/:id", deleteRow);
router.put("/recover/:id", recoverRow);
router.put("/update/:id", updateRow);
module.exports = router;
