package com.Arth.firstProjectCadastro.controller;

import com.Arth.firstProjectCadastro.business.UsuarioService;
import com.Arth.firstProjectCadastro.infrastructure.entitys.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
@CrossOrigin
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Void> salvarUsuario(@RequestBody User usuario) {
        if (usuario == null) {
            return ResponseEntity.noContent().build();
        } else {
            usuarioService.salvarUsuario(usuario);
            return ResponseEntity.ok().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody LoginDTO login) {
        try {
            User usuario = usuarioService.login(login.nome(), login.senha());
            return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/image")
    public ResponseEntity<Void> salvarImagem(@RequestParam String imagemUrl, @RequestParam String nome) {
        usuarioService.salvarImagem(imagemUrl, nome);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar-senhas")
    public ResponseEntity<List<SenhasResponseDTO>> searchSenhas(@RequestParam String email) {
        return ResponseEntity.ok(usuarioService.searchSenhas(email));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenhaEmail(@RequestParam String email) {
        usuarioService.recuperarSenhaEmail(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirmar-senha")
    public ResponseEntity<Void> confirmSenha(@RequestParam String email, @RequestBody NewSenhaDTO Csenha) {
        usuarioService.confirmSenha(email, Csenha.senha());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/atualizarSenha")
    public ResponseEntity<Void> atualizarSenha(@RequestParam String email, @RequestParam int cod, @RequestBody NewSenhaDTO novaSenha) {
        usuarioService.atualizarSenha(email, cod, novaSenha.senha());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/gerar-senha")
    public ResponseEntity<String> gerarSenha(@RequestBody GerarSenhaDTO senhaGerada) {
        String senha = usuarioService.gerarSenha(senhaGerada.tamanho(), senhaGerada.numeros(), senhaGerada.maiusculas(),
                senhaGerada.minusculas(), senhaGerada.especiais());
        return ResponseEntity.ok(senha);
    }

    @PostMapping("/salvar-senha")
    public ResponseEntity<Void> salvarSenha(@RequestParam String email, @RequestBody SalvarSenhaDTO Ssenha) {
        usuarioService.salvarSenha(email, Ssenha.senha(), Ssenha.descricao());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarUsuarioPorEmail(@RequestParam String email) {
        usuarioService.deletarUsuarioPorEmail(email);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/image")
    public ResponseEntity<Void> deletarImagem(@RequestParam String nome) {
        usuarioService.deletarImagem(nome);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarUsuario(@RequestParam String email, @RequestBody User usuario) {
        usuarioService.atualizarUsuario(email, usuario);
        return ResponseEntity.ok().build();
    }
}
