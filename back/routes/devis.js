const express = require('express');
// const bodyParser = require('body-parser');

const router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
const { updateDevisWithClient, getDevisWithClient, getDevisById, getAll, getreff, getref, getOne, postRow, deleteRow, recoverRow, updateRow, getAllActive, getAllDesactive, getDescribe } = require('../controllers/devisController.js');

const { getClientById } = require('../controllers/clientController.js');
const { getUserById } = require('../controllers/userController.js');
const { getNotatsByIdDevis } = require('../controllers/devisWithNotatsController.js');
const { getPrestationByIdDevis } = require('../controllers/devisWithPrestationController.js');


router.get("/", getAll);
router.get("/ref", getref);
router.get("/reff/:reference", getreff);
router.get("/describe", getDescribe);
router.get("/active", getAllActive);
router.get("/desactive", getAllDesactive);
router.get("/:id", getOne);
router.post("/add", postRow);
router.delete("/delete/:id", deleteRow);
router.put("/recover/:id", recoverRow);
router.put("/update/:id", updateRow);

router.get("/all/:id", getDevisWithClient);
router.put("/update/all/:id", updateDevisWithClient);

// router.get("/test/:id", (req,res) => {

//     let devis = getDevisById(req,res);
//     console.log(devis);

//     return res.status(201).json({
//         devis: devis
//     })
// });


router.get("/devisall/:id", async (req, res) => {
    const id = req.params.id;

    let devis = await getDevisById(id);
    let user = await getUserById(id);
    let client = await getClientById(id);
    let prestation = await getPrestationByIdDevis(id);
    let notats = await getNotatsByIdDevis(id);

    console.log()
    return res.status(200).json({
        devis: devis[0],    
        user: user[0],
        client: client[0],
        prestation: prestation,
        notats: notats,

    });
});



module.exports = router;
