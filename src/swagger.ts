import swaggerJSdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pizzaria',
      version: '1.0.0',
      description: 'Documentação da API de Pizzaria',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSdoc(swaggerOptions);

export default swaggerSpec;