const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "Your API description",
    },
    servers: [
      { url: `http://localhost:${PORT}` }, // Adjust the URL based on your deployment
    ],
  },
  apis: ["./controllers/*.js"], 
};

module.exports = swaggerOptions;
