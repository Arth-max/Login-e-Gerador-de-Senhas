//Arquivo de conexão do front-end com o back-end(API)
import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8081'
})

export function closeInputs() {
    document.getElementById('codigo').style.display = 'none'
    document.getElementById('Nsenha').style.display = 'none'
    document.getElementById('UpPass').style.display = 'none'
    document.getElementById('pass').style.display = 'none'
    document.getElementById('msgEsqueciSenha').textContent = ""
}

export default API