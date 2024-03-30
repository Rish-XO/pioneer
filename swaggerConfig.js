const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for my application",
    },
    basePath: "/",
  },
  apis: ["./server.js"], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
