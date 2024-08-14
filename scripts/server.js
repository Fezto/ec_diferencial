import Fastify from "fastify"
import katex from "katex"
import {JSDOM} from "jsdom"
import cors from '@fastify/cors'
import {ask_Wolfram, XML_to_JSON} from "./logic.js";

// * Creamos instancia de Fastify
const app = Fastify({
    logger: true
})

// * Habilitamos CORS para que nuestro servidor pueda comunicarse con la página web
await app.register(cors, {
    origin: "*", // Permitir todas las solicitudes de origen
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
    preflightContinue: false,
    optionsSuccessStatus: 204
})


// * -------- RUTAS ----------

// * Ruta DEBUG
app.get("/debug", async (request, reply) => {
    return {prueba: "bien!"}
})


// ! Paso 5: Recibimos el problema en el sv local por callSolution. Ahora, llamamos a la
// ! función que sí resuelve, getSolution()
app.get("/solution/:encoded_problem", async function handler(request, reply) {
    try {
        const encoded_problem = request.params.encoded_problem;
        const problem_string = decodeURIComponent(encoded_problem)
        const solution_XML = await ask_Wolfram(problem_string)


        // ! Paso 7: Si hay una solución, llamamos a la función que parsea el XML a JSON
        if (solution_XML) {
            const solution_JSON = await XML_to_JSON(solution_XML)

            // ! Paso 9: Una vez parseado el XML a JSON, lo devolvemos
            return solution_JSON
        } else {
            console.error('No solution found in the response:', solution_XML);
            throw new Error('No solution found in the response');
        }
    } catch (err) {
        console.error('Error in /solution/:problem endpoint:', err);
        throw err;
    }
})

//* Ruta que envía la ecuación diferencial en TEX y lo
//* renderiza en el DOM
app.get("/render/:encoded_solution", async (request, reply) => {
    try {
        const encoded_solution = request.params.encoded_solution;
        const solution = decodeURIComponent(encoded_solution)

        console.log(`solución antes de LATEX: ${solution}`)
        const html = katex.renderToString(solution, {
            throwOnError: false
        })

        const dom = new JSDOM(html)
        const mathml = dom.window.document.querySelector(".katex-mathml").outerHTML

        return {html: mathml}
    } catch (error) {
        console.error(error)
    }
})

//* Mantenemos al servidor escuchando
try {
    await app.listen({port: 3117})
    app.log.info(`Server listening on ${app.server.address().port}`)
} catch (err) {
    app.log.error(err)
    process.exit(1)

}

//* Cuando terminemos el programa, cerramos el puerto
process.on('exit', () => {
    app.close(() => {
        console.log('Fastify server closed');
    });
});



