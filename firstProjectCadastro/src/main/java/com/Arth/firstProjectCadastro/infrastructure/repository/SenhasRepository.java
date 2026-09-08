package com.Arth.firstProjectCadastro.infrastructure.repository;

import com.Arth.firstProjectCadastro.infrastructure.entitys.User;
import com.Arth.firstProjectCadastro.infrastructure.entitys.SenhasSalvas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SenhasRepository extends JpaRepository<SenhasSalvas, Integer> {
    List<SenhasSalvas> findByUsuario(User usuario);
}
