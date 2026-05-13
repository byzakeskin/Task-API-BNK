const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Task Manager API', version: '1.0.0', description: 'JWT kimlik doğrulamalı görev yönetimi API' },
    servers: [{ url: 'http://localhost:3000/api', description: 'Geliştirme' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./backend/src/routes/*.js'],
};

module.exports = (app) => {
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
  console.log('📄 Swagger UI: http://localhost:3000/api-docs');
};
