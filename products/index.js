const express = require('express');

const details = require('./details');
const search = require('./search');
const reviews = require('./reviews');
const analytics = require('./analytics');

const router = express.Router();

router.get('/products/details/:id', async (req, res) => {
  try {
    const product = await details.getById(req.params.id);
    res.status(200).json(product);

    if (req.session.passport) {
      analytics.details
        .view(req.session.passport.user, req.params.id, new Date())
        .catch(err => console.log('error saving analytics, ', err));
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/search/:query', async (req, res) => {
  try {
    const results = await search.byString(req.params.query);
    res.status(200).json(results);

    if (req.session.passport) {
      analytics.search
        .query(req.session.passport.user, req.params.query, new Date())
        .catch(err => console.log('error saving analytics, ', err));
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/search/:query/:page', async (req, res) => {
  try {
    const results = await search.byString(req.params.query, Number(req.params.page));
    res.status(200).json(results);

    if (req.session.passport) {
      analytics.search
        .queryPage(req.session.passport.user, req.params.query, req.params.page, new Date())
        .catch(err => console.log('error saving analytics, ', err));
    }
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

    analytics.reviews
      .post(req.session.passport.user, req.params.id, new Date())
      .then(null, err => console.log('error saving analytics, ', err));
    return res.status(200).json(reviewId);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
