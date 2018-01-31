const { client } = require('../../products/database/elasticsearch');
const mysql = require('../../database');

const index = [
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test',
      _type: 'products',
    },
  },
  {
    name: 'productName',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test1',
      _type: 'products',
    },
  },
  {
    name: 'productName 1',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test2',
      _type: 'products',
    },
  },
  {
    name: 'productName 2',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test3',
      _type: 'products',
    },
  },
  {
    name: 'productName 3',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test4',
      _type: 'products',
    },
  },
  {
    name: 'productName 4',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test5',
      _type: 'products',
    },
  },
  {
    name: 'productName 5',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test6',
      _type: 'products',
    },
  },
  {
    name: 'productName 6',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test7',
      _type: 'products',
    },
  },
  {
    name: 'productName 7',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test8',
      _type: 'products',
    },
  },
  {
    name: 'productName 8',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test9',
      _type: 'products',
    },
  },
  {
    name: 'productName 9',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
  {
    index: {
      _index: 'nozama',
      _id: 'test123Test10',
      _type: 'products',
    },
  },
  {
    name: 'productName 10',
    description: 'productDescription',
    categories: ['productCategory'],
    brand: 'productBrand',
    price: 1.99,
  },
];

const remove = [
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test1',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test2',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test3',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test4',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test5',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test6',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test7',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test8',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test9',
      _type: 'products',
    },
  },
  {
    delete: {
      _index: 'nozama',
      _id: 'test123Test10',
      _type: 'products',
    },
  },
];

const reviewsTestData = [
  {
    text: 'sampleText1',
    userId: 999999,
    createdAt: '2002-01-23',
    stars: 5,
    credibility: 10,
    isCustomer: 1,
    productId: 'testProduct1',
  },
  {
    text: 'sampleText2',
    userId: 999999,
    createdAt: '2010-01-23',
    stars: 5,
    credibility: 10,
    isCustomer: 1,
    productId: 'testProduct2',
  },
  {
    text: 'sampleText3',
    userId: 999999,
    createdAt: '2003-01-23',
    stars: 5,
    credibility: 10,
    isCustomer: 1,
    productId: 'testProduct1',
  },
  {
    text: 'sampleText4',
    userId: 999999,
    createdAt: '2012-01-23',
    stars: 5,
    credibility: 10,
    isCustomer: 1,
    productId: 'testProduct2',
  },
  {
    text: 'sampleText5',
    userId: 999999,
    createdAt: '2010-01-23',
    stars: 5,
    credibility: 5,
    isCustomer: 1,
    productId: 'testProduct1',
  },
];

const beforeSetUp = async () => {
  try {
    await client.indices.get({ index: 'nozama' });
  } catch (err) {
    if (err.status === 404) {
      await client.indices.create({ index: 'nozama' });
      await client.indices.refresh();
    }
  }
  try {
    await client.get({
      index: 'nozama',
      type: 'products',
      id: 'test123Test',
    });
  } catch (err) {
    if (err.status === 404) {
      await client.bulk({ body: index });
      await client.indices.refresh();
    }
  }
};

const afterSetDown = () => client.bulk({ body: remove });

const beforeMySQL = () =>
  Promise.all(reviewsTestData.map(review =>
    mysql.queryAsync(
      'INSERT INTO product_reviews (user_id, product_id, text, stars, credibility, created_at, is_customer, is_professional) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [
        review.userId,
        review.productId,
        review.text,
        review.stars,
        review.credibility,
        review.createdAt,
        review.isCustomer,
      ],
    )));

const afterMySQL = () =>
  mysql.queryAsync('DELETE FROM product_reviews WHERE product_id = "testProduct1" OR product_id = "testProduct2"');

const beforeLogin = () =>
  mysql.queryAsync('INSERT INTO users (id, name) VALUES (999999, "testUser123")');

const afterLogin = () => mysql.queryAsync('DELETE FROM users WHERE id = 999999');

module.exports = {
  beforeSetUp,
  afterSetDown,
  beforeMySQL,
  afterMySQL,
  beforeLogin,
  afterLogin,
};
