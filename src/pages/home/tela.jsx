import './tela.css'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Config from '../../assets/Config.png'
import Edit from '../../assets/Edit.png'
import Sun from '../../assets/Sol.png'
import Moon from '../../assets/Lua.png'
import Lixeira from '../../assets/Lixeira.png'
import desverSenha from '../../assets/desverSenha.png'
import verSenha from '../../assets/verSenha.png'
import API from '../../hooks/user.js'
import { useState, useRef } from 'react'

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
    const [tela, setTela] = useState(false)
    const [gerador, setGerador] = useState(false)
    const [senhasSalvas, setSenhasSalvas] = useState(false)
    const [changeTheme, setChangeTheme] = useState(false)
    const [VerSenha, setMostrarSenha] = useState(false)
    const [Sol, setSun] = useState(false)
    const [img, setImg] = useState('')
    const [backgroundImg, setBackgroundImg] = useState(inicialUser.urlImg || '')

    const [valor, setValor] = useState(8)
    const [senha, setSenha] = useState('')
    const inputConfirmSenha = useRef()
    const inputDescricao = useRef()
    const [pass, setSavePass] = useState([])
    const [senhaVisivel, setSenhaVisivel] = useState(null)
    const [useNumeros, setUseNumeros] = useState(false)
    const [useEspeciais, setUseEspeciais] = useState(false)
    const [useMaiusculas, setUseMaiusculas] = useState(false)
    const [useMinusculas, setUseMinusculas] = useState(false)

    const handleRange = (event) => {
        setValor(Number(event.target.value))
    }

    function voltar() {
        setImg('')
        navigate('/')
    }

    function changeColor() {
        setTemaClaro(prev => !prev)
        setSun(prev => !prev)
    }

    function mudarTema() {
        setChangeTheme(prev => !prev)
        setOpenConfig(false)
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
            document.getElementById('msgConfig').textContent = ""
            setOpenConfig(false)
        } else {
            setOpenConfig(true)
            setOpenPerfil(false)
            setChangeTheme(false)
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

    function infoSenhas() {
        if (tela) {
            setTela(false)
        } else {
            setTela(prev => !prev)
        }
    }

    function createS() {
        document.getElementById('SGSenhas').style.display = 'none'
        setGerador(prev => !prev)
    }
    
    async function confirmSenha() {
        const senha = inputConfirmSenha.current.value

        if (senha === "") {
            document.getElementById('msgCS').style.color = 'darkred'
            document.getElementById('msgCS').textContent = "Por favor digite a senha"
            return
        }

        try {
            await API.post(`/usuario/confirmar-senha?email=${encodeURIComponent(usuario.email)}`, {
                senha: senha
            })
            document.getElementById('msgCS').style.color = 'seagreen'
            document.getElementById('msgCS').textContent = "Senha correta"

            const SenhaResponse = await API.get(`/usuario/buscar-senhas?email=${encodeURIComponent(usuario.email)}`)
            setSavePass(SenhaResponse.data)
            
            setTela(false)
            setSenhasSalvas(true)
            if (SenhaResponse.data.length === 0) {
                document.getElementById('msgSS').style.color = 'darkred'
                document.getElementById('msgSS').textContent = "Nenhuma senha salva"
                return
            }
        } catch (error) {
            console.error = error
            document.getElementById('msgCS').style.color = 'darkred'
            document.getElementById('msgCS').textContent = "Senha incorreta"
        }
    }

    async function gerarSenha() {
        try {
            const response = await API.post(`/usuario/gerar-senha`, {
                tamanho: valor,
                numeros: useNumeros,
                especiais: useEspeciais,
                maiusculas: useMaiusculas,
                minusculas: useMinusculas
            })

            setSenha(response.data)

            document.getElementById('msgGS').style.color = 'seagreen'
            document.getElementById('msgGS').textContent = "Senha gerada com sucesso!"
        } catch (error) {
            document.getElementById('msgGS').style.color = 'darkred'
            document.getElementById('msgGS').textContent = "Erro ao gerar senha"
        }
    }

    async function salvarSenha() {
        const descricao = inputDescricao.current.value

        if (descricao === "") {
            document.getElementById('msgGS').style.color = 'darkred'
            document.getElementById('msgGS').textContent = "Por favor digite uma descrição"
            return
        }
        if (senha === "") {
            document.getElementById('msgGS').style.color = 'darkred'
            document.getElementById('msgGS').textContent = "Por favor gere ou digite uma senha"
            return
        }

        try {
            await API.post(`/usuario/salvar-senha?email=${encodeURIComponent(usuario.email)}`, {
                senha: senha,
                descricao: descricao
            })

            setUseMaiusculas(false)
            setUseMinusculas(false)
            setUseEspeciais(false)
            setUseNumeros(false)
            setSenha('')
            setValor(8)
            document.getElementById('msgGS').style.color = 'seagreen'
            document.getElementById('msgGS').textContent = "Senha salva com sucesso"
        } catch (error) {
            document.getElementById('msgGS').style.color = 'darkred'
            document.getElementById('msgGS').textContent = "Erro ao salvar senha"
        }
    }

    function voltarGS() {
        setUseMaiusculas(false)
        setUseMinusculas(false)
        setUseEspeciais(false)
        setUseNumeros(false)
        setSenha('')
        setValor(8)
        document.getElementById('Dsenha').value = ''
        document.getElementById('SGSenhas').style.display = 'flex'
        document.getElementById('msgGS').textContent = ''
        setGerador(false)
    }

    function mostrarSenha() {
        setMostrarSenha(!VerSenha)
    }

    function mostrarSenhas(id) {
        setSenhaVisivel(senhaVisivel === id ? null : id)
    }

    function voltarSS() {
        setSenhasSalvas(false)
        document.getElementById('Csenha').value = ''
        document.getElementById('msgCS').style.display = 'none'
    }
    
    return (
        <div id="main" className={temaClaro ? 'AppBlank' : 'App'} style={{ backgroundImage: backgroundImg ? `url("${backgroundImg}")` : 'none' }}>
            {/* Cabeçelho */}
            <header className="cabecalho">
                <h1>Site de testes</h1>
                <div className="botoes">
                    <button className="editButton" onClick={mudarTema}><img src={Edit} alt="Mudar Tema"/></button>
                    <button className="configButton" onClick={abrirConfig}><img src={Config} alt="Configurações" /></button>
                </div>
            </header>

            {/* Configurações */}
            <div id="Config" className="configurations" style={{ display: OpenConfig ? 'flex' : 'none' }}>
                <h2> Configurações </h2>
                <button className="themeButton" onClick={changeColor}> <img src={Sol ? Sun : Moon}/> Mudar Tema </button>
                <button className="deleteButton" onClick={deleteUsers}> <img src={Lixeira} alt=""/> Deletar Conta </button>
                <p id="msgConfig"></p>
            </div>

            {/* Mudar imagem de fundo */}
            <div id="changeTheme" className="configurations" style={{ display: changeTheme ? 'flex' : 'none' }}>
                <label>Mudar Imagem de fundo</label>
                <input id="imgUrl" type="url" placeholder="Url da imagem" value={img} onChange={(e) => setImg(e.target.value)} />
                {img.trim() !== '' && <button id="ApImg" className="imgButton" onClick={changeImg}> Aplicar </button>}
                {backgroundImg && <button id="DelImg" className="delImgButton" onClick={removeImg}> Remover Imagem </button>}
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
                
                    <div id="SGSenhas" className="card">
                        <h2>🔑 Gerador e Salvador de Senhas</h2>
                        <p> Visualize e crie suas senhas </p>
                        <button onClick={infoSenhas}> Visualizar senhas salvas </button>
                        <button onClick={createS}> Ir gerar Senhas </button>
                    </div>

                    <div className="confirmSenha" style={{display: tela ? 'flex' : 'none'}}>
                        <p>Digite a sua senha do site</p>
                        <div className='senhas'>
                            <input id="Csenha" type={VerSenha ? 'text' : 'password'} name="senha" placeholder="Sua senha" ref={inputConfirmSenha}></input>
                            <button type="button" className='divSenhas' onClick={mostrarSenha}><img src={VerSenha ? desverSenha : verSenha} alt="" /></button>
                        </div>
                        <button className="imgButton" onClick={confirmSenha}> Confirmar Senha </button>
                        <p id="msgCS"></p>
                    </div>

                    <div className="senhasSalvas" style={{display: senhasSalvas ? 'flex' : 'none'}}>
                        <h1> Suas Senhas Salvas </h1>
                        <div id="divSenhas">
                            {pass.map((item) => (
                                <div className="senhaSalva" key={item.id}>
                                    <div className="campoSenha">
                                        <label>{item.descricao}</label>
                                    <input type={senhaVisivel === item.id ? 'text' : 'password'} value={item.senha} readOnly />
                                    <button type="button" onClick={() => mostrarSenhas(item.id)}>
                                        <img src={senhaVisivel === item.id ? desverSenha : verSenha}/>
                                    </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={voltarSS}> Voltar </button>
                        <p id="msgSS"></p>
                    </div>

                    <div className="geradorSenha" style={{display: gerador ? 'flex' : 'none'}}>
                        <h1>Gerador de Senhas</h1>
                        <div className="opcoesSenha">
                            <label htmlFor="myRange"> Tamanho da Senha: </label>
                            <input id="myRange" type="range" min="8" max="20" value={valor} onChange={handleRange}/>

                            <label></label>

                            <label> <span>{valor}</span> </label>

                            <label> <input type="checkbox" checked={useMaiusculas} onChange={(e) => {setUseMaiusculas(e.target.checked)}} value="letrasM" id="Maiusculas" />Maiúsculas </label>
                            
                            <label> <input type="checkbox" checked={useMinusculas} onChange={(e) => {setUseMinusculas(e.target.checked)}} value="letrasm" id="Minusculas" />Minúsculas</label>
                            
                            <label> <input type="checkbox" checked={useNumeros} onChange={(e) => {setUseNumeros(e.target.checked)}} value="numeros" id="numeros" />Números </label>
                            
                            <label> <input type="checkbox" checked={useEspeciais} onChange={(e) => {setUseEspeciais(e.target.checked)}} value="simbolos" id="simbolos" />Simbolos </label>
                        </div>
                        <input id="Dsenha" type="text" name="senha" placeholder="Descrição da sua senha" ref={inputDescricao}></input>
                        <input id="Gsenha" type="text" name="senha" placeholder="Sua senha gerada aqui" value={senha} onChange={(e) => setSenha(e.target.value)}></input>
                        <div className="botoes">
                            <button className="imgButton" onClick={gerarSenha}> Gerar Senha </button>
                            <button className="saveButton" onClick={salvarSenha}> Salvar Senha </button>
                            <button onClick={voltarGS}> Voltar </button>
                        </div>
                        <p id="msgGS"></p>
                    </div>
                </section>
                <button className="logout" onClick={voltar}> Sair </button>
            </main>
        </div>
    )
}

export default Tela