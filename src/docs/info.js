export const info = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Entregable Coder",
            version: "1.0.0",
            description: "Api ecomerce"
        },
        servers: [
            {
                url: "http://localhost:8080"
            },
            {
                url: "https://curso-back.onrender.com/"
            }
        ]
    },
    apis: ["./src/docs/*.yml"],
};