package com.Arth.firstProjectCadastro.business;

import com.Arth.firstProjectCadastro.infrastructure.entitys.User;
import com.Arth.firstProjectCadastro.infrastructure.entitys.senhasSalvas;
import com.Arth.firstProjectCadastro.infrastructure.repository.SenhasRepository;
import com.Arth.firstProjectCadastro.infrastructure.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;


@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final EmailService EmailService;
    private final SenhasRepository senhasRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    public UsuarioService(UsuarioRepository repository, EmailService EmailService, SenhasRepository senhasRepository) {
        this.EmailService = EmailService;
        this.repository = repository;
        this.senhasRepository = senhasRepository;
    }

    public void salvarUsuario(User usuario) {
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RuntimeException("Senha inválida");
        }
        String senhaHash = encoder.encode(usuario.getSenha());
        usuario.setSenha(senhaHash);
        repository.saveAndFlush(usuario);
    }

    public User login(String nome, String senha) {
        User usuario = repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Usuario não encontrado"));

        if (!encoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }
        return usuario;
    }

    public void salvarImagem(String image, String nome) {
        User usuario = repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Usuário não encontrado")
        );
        usuario.setUrlImg(image);
        repository.saveAndFlush(usuario);
    }

    public void deletarImagem(String nome) {
        User usuario = repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Usuário não encontrado")
        );
        usuario.setUrlImg(null);
        repository.saveAndFlush(usuario);
    }

    public void recuperarSenhaEmail(String email) {
        User usuario = repository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("email não encontrado")
        );
        int cod = 100000 + random.nextInt(900000);
        usuario.setCodigoRecuperacao(cod);
        usuario.setCodExpiracao(LocalDateTime.now().plusMinutes(10));
        repository.saveAndFlush(usuario);
        EmailService.enviarEmail(email, "Recuperação de senha", "Seu código é: " + usuario.getCodigoRecuperacao() + "\nDigite este código no site para continuar operação");
    }

    public void atualizarSenha(String email, int cod, String novaSenha) {
        User usuarioEntity = repository.findByEmail(email).orElseThrow(
                    () -> new RuntimeException("Usuario não encontrado")
        );
        if (usuarioEntity.getCodigoRecuperacao() == null || usuarioEntity.getCodExpiracao() == null) {
            throw new RuntimeException("Código inexistente, por favor digite o código");
        }
        if (!LocalDateTime.now().isBefore(usuarioEntity.getCodExpiracao())) {
            usuarioEntity.setCodigoRecuperacao(null);
            usuarioEntity.setCodExpiracao(null);
            repository.saveAndFlush(usuarioEntity);

            throw new RuntimeException("Código expirado");
        }
        if (!usuarioEntity.getCodigoRecuperacao().equals(cod)) {
            throw new RuntimeException("Código inválido");
        }
        if (novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("A senha não pode ser vazia");
        }
            usuarioEntity.setSenha(encoder.encode(novaSenha));
            usuarioEntity.setCodigoRecuperacao(null);
            usuarioEntity.setCodExpiracao(null);
            repository.saveAndFlush(usuarioEntity);
    }

    public void confirmSenha(String email, String senha) {
        User usuario = repository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("Usuario não encontrado")
        );
        if (!encoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }
    }

    public String gerarSenha(int tamanho, Boolean numeros, Boolean Maiusculas, Boolean Minusculas, Boolean Especiais) {
        StringBuilder pool = new StringBuilder();
        StringBuilder senhaCriada = new StringBuilder();

        if (tamanho < 8 || tamanho > 20) {
            throw new RuntimeException("Senha muito grande ou muito pequena");
        }

        String numerosCharacters = "0123456789";
        String maiusculasCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String minusculasCharacters = "abcdefghijklmnopqrstuvwxyz";
        String especiaisCharacters = "!@#$%&*()<>{}/-";

        if (Boolean.TRUE.equals(numeros)) {
            pool.append(numerosCharacters);
            senhaCriada.append(numerosCharacters.charAt(random.nextInt(numerosCharacters.length())));
        }
        if (Boolean.TRUE.equals(Maiusculas)) {
            pool.append(maiusculasCharacters);
            senhaCriada.append(maiusculasCharacters.charAt(random.nextInt(maiusculasCharacters.length())));
        }
        if (Boolean.TRUE.equals(Minusculas)) {
            pool.append(minusculasCharacters);
            senhaCriada.append(minusculasCharacters.charAt(random.nextInt(minusculasCharacters.length())));
        }
        if (Boolean.TRUE.equals(Especiais)) {
            pool.append(especiaisCharacters);
            senhaCriada.append(especiaisCharacters.charAt(random.nextInt(especiaisCharacters.length())));
        }

        if (pool.isEmpty()) throw new RuntimeException("Selecione um tipo de caracterer");

        for (int i = 0; i < tamanho; i++) {
            senhaCriada.append(pool.charAt(random.nextInt(pool.length())));
        }
        return senhaCriada.toString();
    }

    public void salvarSenha(String descricao, String email, String Ssenha) {
        User usuarioEntity = repository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("Usuario não encontrado")
        );

        if (descricao == null || descricao.isBlank()) {
            throw new RuntimeException("Coloque uma descricao para salvar a senha");
        }

        if (Ssenha == null || Ssenha.isBlank()) {
            throw new RuntimeException("Se quiser salvar uma senha, coloque uma senha");
        }

        senhasSalvas salvarSenha = senhasSalvas.builder()
                .Descricao(descricao).SenhaCrypto(Ssenha)
                .dataCriacao(LocalDateTime.now()).usuario(usuarioEntity)
                .build();

        senhasRepository.save(salvarSenha);
    }

    public void atualizarUsuario(String email, User usuario) {
        User usuarioEntity = repository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("Usuario não encontrado")
        );
        if (usuario.getNome() != null) { usuarioEntity.setNome(usuario.getNome()); }
        if (usuario.getEmail() != null) { usuarioEntity.setEmail(usuario.getEmail()); }
        if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) { usuarioEntity.setSenha(encoder.encode(usuario.getSenha())); }
        repository.saveAndFlush(usuarioEntity);
    }

    public void deletarUsuarioPorEmail(String email) {
        repository.deleteByEmail(email);
    }
}