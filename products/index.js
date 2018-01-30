const express = require('express');

const details = require('./details');

const router = express.Router();

router.get('/products/details/:id', async (req, res) => {
  try {
    const product = await details.getById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
