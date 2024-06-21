import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';

let button = document.getElementById("submit_button")
let input = document.getElementById("problem_input")

// ! Paso 1: El usuario da clic en el boton. Inicia todo el proceso
button.addEventListener("click", () => {
    let problem_string = input.value
    console.log(`0. Problema recibido en input: ${problem_string}`)
    printSolution(problem_string)
})

// ! Paso 2: printSolution es llamado.
async function printSolution(problem_string){
    try {
        // ! Paso 3: callSolution es llamado.
        let solution_info = await callSolution(problem_string);
        let solution_string = solution_info.solution
        console.log(`5. Solución recibida por callSolution ${solution_string}`);

        let info_type = document.getElementById("type")
        info_type.textContent = solution_info.type

        // ! Paso 11: callRender es llamado. Esta función pinta en LaTEX la solución en el DOM
        let render = await callRender(solution_string);

        // Obtenemos el elemento donde mostraremos la solución
        const resultElement = document.getElementById('div_solution');

        // Implantamos el html de la solución al elemento
        resultElement.innerHTML = render;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// ! Paso 4: callSolution recibe el problema como string, lo codifica y envía la solicitud a nuestro sv
async function callSolution(problem_string) {
    console.log(`1. Problema recibido en callSolution: ${problem_string}`)
    let encoded_problem = encodeURIComponent(problem_string);
    console.log(`2. Problema codificado en callSolution: ${encoded_problem}`)

    try {
        // ! Aquí específicamente es cuando enviamos la solicitud
        let response = await axios.get(`http://127.0.0.1:3117/solution/${encoded_problem}`);

        // ! Paso 10: Devolvemos el JSON obtenido a printSolution()
        return response.data;
    } catch (error) {
        console.error('Error in call_solution function:', error);
        throw error;
    }
}

async function callRender(solution) {
    let encoded_solution = encodeURIComponent(solution);
    try {
        let response = await axios.get(`http://127.0.0.1:3117/render/${encoded_solution}`);
        return response.data.html;
    } catch (error) {
        console.error('Error in call_render function:', error);
        throw error;
    }
}



