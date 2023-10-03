const { db } = require('../db.js');

// Get All Rows
const getAll = (req, res) => {
  try {
    const q = `SELECT * FROM user`;
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
    const q = `DESCRIBE user`;
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
    const q = `SELECT * FROM user WHERE user_status = ?`;
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
    const q = `SELECT * FROM user WHERE user_status = ?`;
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
    const q = `SELECT * FROM user WHERE id_u = ?`;
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
    const q = `INSERT INTO user SET ?`;
    db.query(q, data, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`user has been created with successfull!`);
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT * FROM devis WHERE id_u = ?`;
    db.query(q, id, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    const q = `DELETE FROM user WHERE id_u = ?`;
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
    const q = `UPDATE user SET ? WHERE id_u = ?`;
    db.query(q, [data, id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`user has been updated with successfull!`);
    });
  } catch (error) {
    console.log(error);
  }
};

// Desactive Row
const deleteRow = (req, res) => {
  const id = req.params.id;
  try {
    const q = `UPDATE user SET user_status = ? WHERE id_u = ?`;
    db.query(q, ['0', id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`user has been deleted with successfull!`);
    });
  } catch (error) {
    console.log(error);
  }
};

// Active Row
const recoverRow = (req, res) => {
  const id = req.params.id;
  try {
    const q = `UPDATE user SET user_status = ? WHERE id_u = ?`;
    db.query(q, ['1', id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(`user has been recovered with successfull!`);
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
  getOne,
  postRow,
  updateRow,
  deleteRow,
  recoverRow,
  getUserById,deleteUserById
};

