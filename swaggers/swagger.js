const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Express Service with Swagger",
            version: "1.0.0",
            descriptions: "API DOCS"
        },
        host: "http://15.165.177.193:8000",
        basePath: "/"
    },
    apis: ["./routes/*.js"],
}

module.exports = options;