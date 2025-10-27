const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Alertes Citoyennes',
            version: '1.0.0',
            description: 'API permettant de remonter et gérer des alertes citoyennes.',
        },
        servers: [
            {
                url: 'http://localhost:3000', // à adapter selon ton environnement
            },
        ],
    },
    apis: ['./routes/*.js'], // chemins vers tes fichiers avec la doc JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('✅ Swagger disponible sur http://localhost:3000/api-docs');
}

module.exports = setupSwagger;
