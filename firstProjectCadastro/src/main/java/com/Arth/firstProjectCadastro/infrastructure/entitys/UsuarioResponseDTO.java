package com.Arth.firstProjectCadastro.infrastructure.entitys;


public record UsuarioResponseDTO(String nome, String email, String urlImg) {
    public UsuarioResponseDTO(User usuario) {
        this(usuario.getNome(), usuario.getEmail(), usuario.getUrlImg());
    }
}
