import axios from "axios";
import xml2js from "xml2js";

export async function getSolution(query) {
    try {
        const app_id = 'LY94YL-78VLUPEHQK';  // Replace this with your App ID
        const base_url = "http://api.wolframalpha.com/v2/query";
        const response = await axios.get(base_url, {
            params: {
                "input": query,
                "appid": app_id
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error in getSolution function:', err);
        throw err;
    }
}

export async function parseSolution(xmlContent) {
    try {
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlContent);
        const pods = result.queryresult.pod;
        for (let pod of pods) {
            if (pod.$.title === 'Differential equation solution') {
                const solution = pod.subpod[0].plaintext[0];
                return solution;
            }
        }
    } catch (err) {
        console.error('Error in parseSolution function:', err);
        throw err;
    }
}