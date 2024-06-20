import axios from "axios"

let button = document.getElementById("submit_button")
let input = document.getElementById("problem_input")

button.addEventListener("click", () => {
    let problem = input.value
    printSolution(problem)
})

async function callSolution(problem) {
    console.log(`1. Problema recibido en callSolution: ${problem}`)
    let encodedProblem = encodeURIComponent(problem);
    console.log(`2. Problema codificado en callSolution: ${encodedProblem}`)

    try {
        let response = await axios.get(`http://127.0.0.1:3117/solution/${encodedProblem}`);
        console.log(`3. Respuesta recibida: ${encodedProblem}`)
        return response.data.solution;
    } catch (error) {
        console.error('Error in call_solution function:', error);
        throw error;
    }
}

async function callRender(solution) {
    let encodedSolution = encodeURIComponent(solution);
    try {
        let response = await axios.get(`http://127.0.0.1:3117/render/${encodedSolution}`);
        return response.data.html;
    } catch (error) {
        console.error('Error in call_render function:', error);
        throw error;
    }
}
async function printSolution(problem){
    try {
        let solution = await callSolution(problem);
        console.log(`4. Solución recibida por callSolution ${solution}`);

        let render = await callRender(solution);

        // Obtenemos el elemento donde mostraremos la solución
        const resultElement = document.getElementById('div_solution');

        // Implantamos el html de la solución al elemento
        resultElement.innerHTML = render;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

