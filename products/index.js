const express = require('express');

const details = require('./details');
const search = require('./search');
const reviews = require('./reviews');

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

router.get('/products/search/:query/:page', async (req, res) => {
  try {
    const results = await search.byString(req.params.query, Number(req.params.page));
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/reviews/:id', async (req, res) => {
  try {
    const reviewsList = await reviews.getByProductId(req.params.id);
    res.status(200).json(reviewsList);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/reviews', async (req, res) => {
  if (!req.session.passport) {
    return res.sendStatus(401);
  }
  try {
    const reviewsList = await reviews.getByUserId(req.session.passport.user);
    return res.status(200).json(reviewsList);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/products/reviews/:id', async (req, res) => {
  if (!req.session.passport) {
    return res.sendStatus(401);
  }
  try {
    const reviewId = await reviews.insert(
      req.session.passport.user,
      req.params.id,
      req.body.text,
      req.body.stars,
    );
    return res.status(200).json(reviewId);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
