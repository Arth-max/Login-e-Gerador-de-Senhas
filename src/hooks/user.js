//Arquivo de conexão do front-end com o back-end(API)
import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8081'
})

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

API.interceptors.request.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export function closeInputs() {
    document.getElementById('codigo').style.display = 'none'
    document.getElementById('Nsenha').style.display = 'none'
    document.getElementById('UpPass').style.display = 'none'
    document.getElementById('pass').style.display = 'none'
    document.getElementById('msgEsqueciSenha').textContent = ""
}

export default API