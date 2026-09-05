package com.Arth.firstProjectCadastro.business;

import com.Arth.firstProjectCadastro.infrastructure.entitys.User;
import com.Arth.firstProjectCadastro.infrastructure.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Random;


@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final emailService EmailService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    public UsuarioService(UsuarioRepository repository, emailService EmailService) {
        this.EmailService = EmailService;
        this.repository = repository;
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

    public void salvarSenha(String email, String Ssenha) {
        User usuarioEntity = repository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("Usuario não encontrado")
        );
        usuarioEntity.setSenha(encoder.encode(Ssenha));
        repository.saveAndFlush(usuarioEntity);
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