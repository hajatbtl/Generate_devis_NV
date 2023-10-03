export const routes_api = (table_name) => {
    return `
import express from 'express';
// import bodyParser from 'body-parser';

const router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
import { getAll, getOne, postRow, deleteRow, recoverRow, updateRow, getAllActive, getAllDesactive, getDescribe } from '../controllers/${table_name}Controller.js';

router.get("/", getAll);
router.get("/describe", getDescribe);
router.get("/active", getAllActive);
router.get("/desactive", getAllDesactive);
router.get("/:id", getOne);
router.post("/add", postRow);
router.put("/delete/:id", deleteRow);
router.put("/recover/:id", recoverRow);
router.put("/update/:id", updateRow);
export default router;
`;
}
