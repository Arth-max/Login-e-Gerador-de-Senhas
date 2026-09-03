import './tela.css'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Config from '../../assets/Config.png'
import API from '../../hooks/user.js'
import { useState } from 'react'

function Tela() {
    const Location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const inicialUser = Location.state?.usuario || {}
    const [usuario, setUsuario] = useState(inicialUser)
    const [nome, setNome] = useState(inicialUser.nome || '')
    const [email, setEmail] = useState(inicialUser.email || '')
    const [temaClaro, setTemaClaro] = useState(false)
    const [OpenPerfil, setOpenPerfil] = useState(false)
    const [OpenConfig, setOpenConfig] = useState(false)
    const [img, setImg] = useState(inicialUser.urlImg || '')
    const [backgroundImg, setBackgroundImg] = useState(inicialUser.urlImg || '')

    function voltar() {
        navigate('/')
    }

    function changeColor() {
        setTemaClaro(prev => !prev)
    }

    async function changeImg() {
        const imageUrl = encodeURIComponent(img)
        const nomeUser = encodeURIComponent(usuario.nome)

        if (!img.trim()) { return; }

        try {
            new URL(img)
        } catch (error) {
            document.getElementById('msgConfig').style.color = 'darkred'
            document.getElementById('msgConfig').textContent = "URL inválida"
            return
        }
        try {
            await API.post(`/usuario/image?imagemUrl=${imageUrl}&nome=${nomeUser}`)
            setBackgroundImg(img)
            setUsuario({
                ...usuario,
                urlImg: img
            })
            setImg('')
            document.getElementById('msgConfig').style.color = 'seagreen'
            document.getElementById('msgConfig').textContent = "Imagem de fundo aplicada com sucesso"
        } catch (error) {
            document.getElementById('msgConfig').style.color = 'darkred'
            document.getElementById('msgConfig').textContent = "Erro ao aplicar imagem de fundo"
        }
    }

    async function removeImg() {
        try {
            await API.delete(`/usuario/image?nome=${encodeURIComponent(usuario.nome)}`)
            setBackgroundImg('')
            setImg('')
            document.getElementById('msgConfig').style.color = 'seagreen'
            document.getElementById('msgConfig').textContent = "Imagem de fundo removida com sucesso"
        } catch (error) {
            document.getElementById('msgConfig').style.color = 'darkred'
            document.getElementById('msgConfig').textContent = "Erro ao remover imagem de fundo"
        }
    }

    function infoPerfil() {
        document.getElementById('perfil').style.display = 'none'
        setOpenPerfil(true)
        setOpenConfig(false)
    }

    function fecharInfo() {
        document.getElementById('perfil').style.display = 'flex'
        setOpenPerfil(false)
    }

    function abrirConfig() {
        if (OpenConfig) {
            setOpenConfig(false)
        } else {
            setOpenConfig(true)
            setOpenPerfil(false)
            document.getElementById('perfil').style.display = 'flex'
        }
    }
    async function editarPerfil() {
        setLoading(true)
        try {
            const novoNome = nome
            const novoEmail = email

            if (novoNome === usuario.nome && novoEmail === usuario.email) {
                document.getElementById('msg').style.display = 'block'
                document.getElementById('msg').style.color = 'darkred'
                document.getElementById('msg').textContent = "Você não mudou seu perfil"
                setLoading(false)
                return
            }
            if (novoNome === '' || novoEmail === '') {
                document.getElementById('msg').style.display = 'block'
                document.getElementById('msg').style.color = 'darkred'
                document.getElementById('msg').textContent = "Por favor preencha todos os campos"
                setLoading(false)
                return
            }

            setLoading(true)
            await API.put(`/usuario?email=${usuario.email}`, {
                email: novoEmail,
                nome: novoNome
            })
            document.getElementById('msg').style.display = 'block'
            document.getElementById('msg').style.color = 'seagreen'
            document.getElementById('msg').textContent = "Perfil atualizado com sucesso"
            setUsuario({
                ...usuario,
                nome: novoNome,
                email: novoEmail
            })
        } catch (error) {
            document.getElementById('msg').style.display = 'block'
            document.getElementById('msg').style.color = 'darkred'
            document.getElementById('msg').textContent = "Erro ao atualizar perfil"
        } finally {
            setLoading(false)
        }
    }

    async function deleteUsers() {
        const confirmDelete = window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")

        if (!confirmDelete) {
            return
        } else {
            try {
                await API.delete(`/usuario?email=${usuario.email}`)
                alert("Usuário deletado com sucesso!")
                navigate('/')
            } catch (error) {
                document.getElementById('msg').style.color = 'darkred'
                document.getElementById('msg').textContent = "Não foi possível deletar o usuário"
            }
        }
    }
    return (
        <div id="main" className={temaClaro ? 'AppBlank' : 'App'} style={{ backgroundImage: backgroundImg ? `url("${backgroundImg}")` : 'none' }}>
            {/* Cabeçelho */}
            <header className="cabecalho">
                <h1>Site de testes</h1>
                <button className="configButton" onClick={abrirConfig}><img src={Config} alt="Configurações" /></button>
            </header>

            {/* Configurações */}
            <div id="Config" className="configurations" style={{ display: OpenConfig ? 'flex' : 'none' }}>
                <h2> Configurações </h2>
                <label>Mudar Imagem de fundo</label>
                <input id="imgUrl" type="url" placeholder="Url da imagem" value={img} onChange={(e) => setImg(e.target.value)} />
                {img.trim() !== '' && <button id="ApImg" className="imgButton" onClick={changeImg}> Aplicar </button>}
                {backgroundImg && <button id="DelImg" className="delImgButton" onClick={removeImg}> Remover Imagem </button>}
                <button className="themeButton" onClick={changeColor}> Mudar tema do Site </button>
                <button className="deleteButton" onClick={deleteUsers}> Deletar Conta </button>
                <p id="msgConfig"></p>
            </div>

            {/* Site */}
            <main className="principal">
                <h1>Bem-Vindo(a) {usuario.nome || 'Usuário'}</h1>

                {/* Card de informações do usuário */}
                <section className="cards">
                    <div id="perfil" className="card">
                        <h2>🙋‍♂️ Seu Perfil</h2>
                        <p> Visualize e edite suas informações de usuário </p>
                        <button onClick={infoPerfil}> Visualizar </button>
                    </div>

                    <div id="informaçõesPerfil" className="informacoes" style={{ display: OpenPerfil ? 'flex' : 'none' }}>
                        <h1>Suas informações</h1>
                        <label htmlFor="nome">Nome</label>
                        <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <div className="botoes">
                            <button onClick={editarPerfil} disabled={loading}> {loading ? "Editando..." : "Editar"}</button>
                            <button onClick={fecharInfo}> Fechar </button>
                        </div>
                        <p id="msg" className="beforeCodigo"></p>
                    </div>
                </section>
                <button className="logout" onClick={voltar}> Sair </button>
            </main>
        </div>
    )
}

export default Tela