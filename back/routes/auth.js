const express = require('express');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { db } = require("../db.js");
const router = express.Router();

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const q = 'select * from user WHERE email = ?';
    db.query(q, email, async (err, data) => {
        if (err) {
            return res.status(500).json(err);
        } else if (data.length === 0) {
            res.status(401).json("Wrong credentials!");
        } else {
            const user = data[0];

            // var key = process.env.PASS_SEC;
            const encryptedPassword = user.mdp;

            // const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, key);
            // const originalPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
            if (encryptedPassword !== password) {
                return res.status(401).json("Wrong credentials!");
            } else {
                const accessToken = jwt.sign({
                    id: user.id_u,
                    email: user.email,
                    tel: user.tel,
                    nom: user.nom,
                    prenom: user.prenom,
                }, process.env.JWT_SEC_KEY, {
                    expiresIn: "3d"
                });
                const userId = user.id_u;
                // const profile = user.profile_id;
                return res.status(200).json({ userId, accessToken });
            }
        }
    });
});

module.exports = router;
