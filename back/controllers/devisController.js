const { db } = require('../db.js');

// Get All Rows
const getAll = (req, res) => {
    try {
        const q = `SELECT * FROM devis`;
        db.query(q, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

// Get Describe
const getDescribe = (req, res) => {
    try {
        const q = `DESCRIBE devis`;
        db.query(q, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

// Get All Active
const getAllActive = (req, res) => {
    try {
        const q = `SELECT * FROM devis WHERE devis_status = ?`;
        db.query(q, [1], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

// Get All Desactive
const getAllDesactive = (req, res) => {
    try {
        const q = `SELECT * FROM devis WHERE devis_status = ?`;
        db.query(q, [0], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

// Get One Row
const getOne = (req, res) => {
    const id = req.params.id;
    try {
        const q = `SELECT * FROM devis WHERE id_d = ?`;
        db.query(q, id, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

// const getDevisById = (req, res) => {
//     const id = req.params.id;
//     try {
//         const q = `SELECT * FROM devis WHERE id_d = ?`;
//         db.query(q, id, (err, data) => {
//             if (err) return res.status(500).send(err);
//             return data;
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

const getDevisById = (id) => {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM devis WHERE id_d = ?`;
        db.query(q, id, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};
const deleteDevisById = (id) => {
    return new Promise((resolve, reject) => {
        const q = `DELETE FROM devis WHERE id = ?`;
        db.query(q, [id], (err, result) => {
            if (err) reject(err);
            resolve(result.affectedRows > 0); // Check if a row was affected (deleted)
        });
    });
};
// Insert Row
const postRow = (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const q = `INSERT INTO devis SET ?`;
        db.query(q, data, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(data);
        });

    } catch (error) {
        console.log(error);
    }
};

// Update Row
const updateRow = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const q = `UPDATE devis SET ? WHERE id_d = ?`;
        db.query(q, [data, id], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(`Devis has been updated successfully!`);
        });
    } catch (error) {
        console.log(error);
    }
};

// Desactive Row
const deleteRow = async (req, res) => {
    const id = req.params.id;
    try {
        db.beginTransaction();

        const q1 = 'DELETE FROM deviswithnotats WHERE id_d = ?';
        const q2 = 'DELETE FROM deviswithprestation WHERE id_d = ?';
        const q3 = 'DELETE FROM client WHERE id_c = (SELECT id_c from devis where id_d = ?)';
        const q4 = 'DELETE FROM devis WHERE id_d = ?';

        db.query(q1, [id]);
        db.query(q2, [id]);
        db.query(q3, [id]);
        db.query(q4, [id]);

        db.commit();

        return res.status(201).json(`Devis has been deleted successfully!`);

    } catch (error) {
        console.log(error);
    }
};

const getref = (req, res) => {
    try {
        const q = `SELECT 
        user.nom, user.prenom, user.email,
        devis.id_d,devis.titre_d, devis.reference, devis.date, devis.nom_inter, devis.prenom_inter, devis.tel_inter, devis.mail_inter,
        devis.id_c, devis.id_u,
        client.id_c,client.nom_c AS nom_client, client.prenom AS prenom_c,client.nom AS nom_c, client.tel AS tel_c, client.mail AS mail_c, client.adresse, client.adressef,client.mission,
        client.image,prestation.id_p, prestation.titre, prestation.tva, prestation.prix
    FROM 
        user
        JOIN devis ON user.id_u = devis.id_u
        JOIN devisWithPrestation ON devis.id_d = devisWithPrestation.id_d
        JOIN prestation ON devisWithPrestation.id_p = prestation.id_p
        JOIN client ON devis.id_c = client.id_c
        GROUP BY devis.id_d
        ORDER BY devis.id_d DESC;
         `;
        db.query(q, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

const getreff = (req, res) => {
    try {
        const reference = req.params.reference; // Assuming the reference is passed as a parameter
        const query = `SELECT DISTINCT devis.date, devis.reference, user.nom, client.nom_c 
                     FROM devis 
                     JOIN client ON devis.id_c = client.id_c
                     JOIN user ON devis.id_u = user.id_u
                         `;

        db.query(query, [reference], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(data);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};


// Active Row
const recoverRow = (req, res) => {
    const id = req.params.id;
    try {
        const q = `UPDATE devis SET devis_status = ? WHERE id_d = ?`;
        db.query(q, ['1', id], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(`Devis has been recovered successfully!`);
        });
    } catch (error) {
        console.log(error);
    }

};


const getDevisWithClient = (req, res) => {
    const id = req.params.id;
    try {
        const query = `SELECT 
        user.nom, user.prenom, user.email,
        devis.id_d,devis.titre_d, devis.reference, devis.date, devis.nom_inter, devis.prenom_inter, devis.tel_inter, devis.mail_inter,
        devis.id_c, devis.id_u,
        client.id_c,client.nom_c AS nom_client, client.prenom AS prenom_c,client.nom AS nom_c, client.tel AS tel_c, client.mail AS mail_c, client.adresse, client.adressef,client.mission,
        client.image,
        prestation.id_p, prestation.titre,prestation.texte, prestation.tva, prestation.prix,
        notats.id_n,notats.titre_n,notats.texte_n
    FROM 
        user
        JOIN devis ON user.id_u = devis.id_u
        JOIN devisWithPrestation ON devis.id_d = devisWithPrestation.id_d
        JOIN devisWithNotats ON devis.id_d = devisWithNotats.id_d
        JOIN prestation ON devisWithPrestation.id_p = prestation.id_p
        JOIN notats ON devisWithNotats.id_n = notats.id_n
        JOIN client ON devis.id_c = client.id_c
    
        WHERE devis.id_d = ?`;
        db.query(query, id, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

const updateDevisWithClient = (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        const query = `UPDATE devis 
                     JOIN client ON devis.id_c = client.id_c 
                     SET devis.date = ?, devis.reference = ?,devis.nom_inter=?,devis.prenom_inter=?,devis.mail_inter=?,devis.tel_inter=?,
                     devis.prerequis= ?,devis.visite= ?,devis.mission_dec= ?,devis.preavis= ?,devis.accompte= ?,
                      client.nom_c = ?, client.adresse = ?, client.tel = ?, 
                         client.mail = ?, client.adressef = ?, client.mission = ?, client.nom = ?, client.prenom = ?, 
                         client.image = ?
                     WHERE devis.id_d = ?`;
        const values = [
            updatedData.date,
            updatedData.reference,
            updatedData.nom_inter,
            updatedData.prenom_inter,
            updatedData.mail_inter,
            updatedData.tel_inter,
            updatedData.prerequis,
            updatedData.visite,
            updatedData.mission_dec,
            updatedData.preavis,
            updatedData.accompte,
            updatedData.nom_c,
            updatedData.adresse,
            updatedData.tel,
            updatedData.mail,
            updatedData.adressef,
            updatedData.mission,
            updatedData.nom,
            updatedData.prenom,
            updatedData.image,

            id
        ];

        db.query(query, values, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};




module.exports = {
    getAll,
    getref,
    getDescribe,
    getAllActive,
    getAllDesactive,
    getOne,
    getDevisById,
    postRow,
    updateRow,
    deleteRow,
    recoverRow,
    getreff,
    getDevisWithClient, updateDevisWithClient,
};



