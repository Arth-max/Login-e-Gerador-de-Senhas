package com.Arth.firstProjectCadastro.infrastructure.repository;

import com.Arth.firstProjectCadastro.infrastructure.entitys.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<User, Integer> {
    Optional<User> findByNome (String nome);
    Optional<User> findByEmail (String email);

    @Transactional
    void deleteByEmail(String email);
}
