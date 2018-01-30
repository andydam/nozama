const { client } = require('../../products/database/elasticsearch');

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
    name: 'productName1',
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
    name: 'productName2',
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
    name: 'productName3',
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
    name: 'productName4',
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
    name: 'productName5',
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
    name: 'productName6',
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
    name: 'productName7',
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
    name: 'productName8',
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
    name: 'productName9',
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
    name: 'productName10',
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

module.exports = {
  beforeSetUp,
  afterSetDown,
};
