const express = require('express');

const details = require('./details');
const search = require('./search');

const router = express.Router();

router.get('/products/details/:id', async (req, res) => {
  try {
    const product = await details.getById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/search/:query', async (req, res) => {
  try {
    const results = await search.byString(req.params.query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
