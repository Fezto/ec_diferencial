import axios from "axios";
import xml2js from "xml2js";

//! Paso 6: Recibimos el llamado de nuestro sv local. Ahora, el problema es enviado a WolframAlpha API,
//! el cual retorna un archivo XML que tiene que ser parseado.
export async function ask_Wolfram(problem_string) {
    try {
        console.log(`5. Query a enviar a Wolfram: ${problem_string}`)
        const app_id = 'LY94YL-78VLUPEHQK';
        const base_url = `http://api.wolframalpha.com/v2/query?input=${encodeURIComponent(problem_string)}&appid=${app_id}`;
        const solution_XML = await axios.get(base_url);
        return solution_XML.data;
    } catch (err) {
        console.error('Error in getSolution function:', err);
        throw err;
    }
}

//! Paso 8: Recibimos el XML. Obtenemos todos los pods (secciones) devueltas por WolframAlpha y
//! agarramos solo aquellos que nos sirvan. Retornamos lo útil como JSON
export async function XML_to_JSON(solution_XML) {
    try {
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(solution_XML);
        const pods = result.queryresult.pod;
        let response = {}
        for (let pod of pods) {

            console.log(pod.$.title)
            if (pod.$.title === 'Differential equation solution' || pod.$.title === 'Differential equation solutions') {
                response["solution"] = pod.subpod[0].plaintext[0];
            }

            if(pod.$.title === "ODE classification"){
                response["type"] = pod.subpod[0].plaintext[0]
            }
        }
        return response;
    } catch (err) {
        console.error('Error in parseSolution function:', err);
        throw err;
    }
}