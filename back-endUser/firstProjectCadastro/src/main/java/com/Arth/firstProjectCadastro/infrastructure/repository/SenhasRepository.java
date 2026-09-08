package com.Arth.firstProjectCadastro.infrastructure.repository;

import com.Arth.firstProjectCadastro.infrastructure.entitys.User;
import com.Arth.firstProjectCadastro.infrastructure.entitys.senhasSalvas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SenhasRepository extends JpaRepository<senhasSalvas, Integer> {
    List<senhasSalvas> findByUsuario(User usuario);
}
