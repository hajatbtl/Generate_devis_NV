const { db } = require('../db.js');

// Get All Rows
const getAll = (req, res) => {
    try {
        const q = `SELECT * FROM client`;
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
        const q = `DESCRIBE client`;
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
        const q = `SELECT * FROM client WHERE client_status = ?`;
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
        const q = `SELECT * FROM client WHERE client_status = ?`;
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
        const q = `SELECT * FROM client WHERE id_c = ?`;
        db.query(q, id, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
    }
};

// Insert Row
const postRow = (req, res) => {
    const data = req.body;
    try {
        const q = `INSERT INTO client SET ?`;
        db.query(q, data, (err, data) => {
            if (err) return res.status(500).send(err);
              return res.status(201).json(data);
        });

        


    } catch (error) {
        console.log(error);
    }
};
const getClientById = (id) => {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM client WHERE id_c = (SELECT id_c from devis where id_d = ?)`;
        db.query(q, id, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};
const deleteClientById = (id) => {
    return new Promise((resolve, reject) => {
      const q = `DELETE FROM client WHERE id_c = ?`;
      db.query(q, [id], (err, result) => {
        if (err) reject(err);
        resolve(result.affectedRows > 0); // Check if a row was affected (deleted)
      });
    });
  };



// Update Row
const updateRow = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const q = `UPDATE client SET ? WHERE id_c = ?`;
        db.query(q, [data, id], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(`Client has been updated successfully!`);
        });
    } catch (error) {
        console.log(error);
    }
};



// Desactive Row
const deleteRow = (req, res) => {
    const id = req.params.id;
    try {
        const q = `UPDATE client SET client_status = ? WHERE id_c = ?`;
        db.query(q, ['0', id], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(`Client has been deleted successfully!`);
        });
    } catch (error) {
        console.log(error);
    }
};



// Active Row
const recoverRow = (req, res) => {
    const id = req.params.id;
    try {
        const q = `UPDATE client SET client_status = ? WHERE id_c = ?`;
        db.query(q, ['1', id], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(`Client has been recovered successfully!`);
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAll,
    getDescribe,
    getAllActive,
    getAllDesactive,
    getClientById,
    getOne,
    postRow,
    updateRow,
    deleteRow,
    recoverRow,deleteClientById
};
