const { db } = require('../db.js');

// Get All Rows
const getAll = (req, res) => {
  try {
    const q = `SELECT * FROM devisWithNotats`;
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
    const q = `DESCRIBE devisWithNotats`;
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
    const q = `SELECT * FROM devisWithNotats WHERE user_status = ?`;
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
    const q = `SELECT * FROM devisWithNotats WHERE devisWithNotats_status = ?`;
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
    const q = `SELECT * FROM devisWithNotats WHERE id_d = ?`;
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  } catch (error) {
    console.log(error);
  }
};

// const getNotatsByIdDevis = (req, res) => {
//   const id = req.params.id;
//   try {
//     const q = `SELECT n.* FROM notats n
//     INNER JOIN devisWithNotats d ON d.id_n = n.id_n AND d.id_d = ?`;
//     db.query(q, id, (err, data) => {
//       if (err) return res.status(500).send(err);
//       return res.status(200).json(data);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };




const getNotatsByIdDevis = (id) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT n.* FROM notats n
    INNER JOIN devisWithNotats d ON d.id_n = n.id_n AND d.id_d = ?`;
    db.query(q, id, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
const deleteNotatsByIdDevis = (id) => {
  return new Promise((resolve, reject) => {
    const q = `DELETE FROM devisWithNotats WHERE id_d = ?`;
    db.query(q, [id], (err, result) => {
      if (err) reject(err);
      resolve(result); // Check if rows were affected (deleted)
    });
  });
};


// Insert Row
const postRow = (req, res) => {
  const data = req.body;
  try {
    const q = `INSERT INTO devisWithNotats SET ?`;
    db.query(q, data, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`devisWithNotats has been created with successfull!`);
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
    const q = `UPDATE devisWithNotats SET ? WHERE id_d = ?`;
    db.query(q, [data, id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`devisWithNotats has been updated with successfull!`);
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteRow = (req, res) => {
  const id = req.params.id;
  try {
      const q = 'DELETE FROM devisWithNotats WHERE id_d = ?';
      db.query(q, id, (err, data) => {
          if (err) return res.status(500).send(err);
          return res.status(201).json('Notats has been deleted successfully!');
      });
  } catch (error) {
      console.log(error);
  }
};

// Active Row
const recoverRow = (req, res) => {
  const id = req.params.id;
  try {
    const q = `UPDATE devisWithNotats SET user_status = ? WHERE id_d = ?`;
    db.query(q, ['1', id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`devisWithNotats has been recovered with successfull!`);
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
  getNotatsByIdDevis,
  getOne,
  postRow,
  updateRow,
  deleteRow,
  recoverRow,
  deleteNotatsByIdDevis,
};

