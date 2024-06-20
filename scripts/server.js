import Fastify from "fastify"
import katex from "katex"
import { JSDOM } from "jsdom"
import cors from '@fastify/cors'
import { getSolution, parseSolution } from "./logic.js";

//* Creamos instancia de Fastify
const app = Fastify({
    logger: true
})

//* Habilitamos CORS para que nuestro servidor pueda
//* comunicarse con la página web
await app.register(cors, {
    logLevel: "debug"
})



//* -------- RUTAS ----------

//* Ruta DEBUG
app.get("/debug", async (request, reply) => {
    return {prueba: "bien!"}
})

//* Ruta que recibe el problema y retorna en TEX la
//* la solución
app.get("/solution/:problem", async function handler(request, reply) {
    try {
        const encodedProblem = request.params.problem;
        const problem = decodeURIComponent(encodedProblem)
        console.log('Problem:', problem);  // Log the problem
        const solution = await getSolution(problem)
        const parsedSolution = await parseSolution(solution)
        return {solution: parsedSolution}
    } catch (err) {
        console.error('Error in /solution/:problem endpoint:', err);
        throw err;
    }
})

//* Ruta que envía la ecuación diferencial en TEX y lo
//* renderiza en el DOM
app.get("/render/:solution", async (request, reply) => {
    try {
        const encodedSolution = request.params.solution;
        const solution = decodeURIComponent(encodedSolution)

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



