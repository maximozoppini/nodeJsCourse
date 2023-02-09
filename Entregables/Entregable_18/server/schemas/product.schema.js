const { buildSchema } = require("graphql");

const productSchema = buildSchema(`
  type Product {
    id: ID!
    title: String,
    price: Float,
    thumbnail: String
  }
  input ProductInput {
    title: String,
    price: Float,
    thumbnail: String
  }
  type Query {
    getProduct(id: ID!): Product,
    getProducts: [Product],
  }
  type Mutation {
    createProduct(datos: ProductInput): Product,
    updateProduct(id: ID!, datos: ProductInput): Product,
    deleteProduct(id: ID!): Product,
  }
`);

module.exports = { productSchema };
