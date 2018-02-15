const express = require('express');
const fetch = require('node-fetch');
const jsonParser = require('body-parser').json();

const collaborativePath = process.env.COLLAB_PATH;
const contentPath = process.env.CONTENT_PATH;

const details = require('./details');
const search = require('./search');
const reviews = require('./reviews');
const analytics = require('./analytics');
const cache = require('./cache');

const router = express.Router();

router.get('/products/details/:id', async (req, res) => {
  try {
    const product = await cache.memoize(details.getById, req.params.id);
    res.status(200).json(product);

    if (req.session.passport) {
      analytics.details
        .view(req.session.passport.user, req.params.id, new Date())
        .catch((err) => console.log('error saving analytics, ', err));
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/search/:query', async (req, res) => {
  try {
    const results = await cache.memoize(search.byString, req.params.query);
    res.status(200).json(results);

    if (req.session.passport) {
      analytics.search
        .query(req.session.passport.user, req.params.query, new Date())
        .catch((err) => console.log('error saving analytics, ', err));
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/search/:query/:page', async (req, res) => {
  try {
    const results = await cache.memoize(
      search.byString,
      req.params.query,
      Number(req.params.page),
    );
    res.status(200).json(results);

    if (req.session.passport) {
      analytics.search
        .queryPage(
          req.session.passport.user,
          req.params.query,
          req.params.page,
          new Date(),
        )
        .catch((err) => console.log('error saving analytics, ', err));
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/reviews/:id', async (req, res) => {
  try {
    const reviewsList = await cache.memoize(
      reviews.getByProductId,
      req.params.id,
    );
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
    const reviewsList = await cache.memoize(
      reviews.getByUserId,
      req.session.passport.user,
    );
    return res.status(200).json(reviewsList);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/products/reviews/:id', jsonParser, async (req, res) => {
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
      .then(null, (err) => console.log('error saving analytics, ', err));
    return res.status(200).json(reviewId);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/products/related/:id', async (req, res) => {
  if (!collaborativePath && !contentPath) {
    return res.sendStatus(504);
  }
  try {
    const urls = [
      `${collaborativePath}${req.params.id}`,
      `${contentPath}${req.params.id}`,
    ];
    const data = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((resp) =>
            resp.text().then((text) => {
              try {
                const json = JSON.parse(text);
                return json;
              } catch (err) {
                return [];
              }
            }),
          )
          .catch(() => []),
      ),
    );

    return res.status(200).json({
      collaborative: data[0],
      content: Array.isArray(data[1]) ? data[1] : data[1].related,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
