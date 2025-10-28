const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Chargement du fichier YAML
const swaggerDocument = YAML.load('./contracts/swagger.yaml');

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('✅ Swagger (YAML) disponible sur http://localhost:3000/api-docs');
}

module.exports = setupSwagger;

