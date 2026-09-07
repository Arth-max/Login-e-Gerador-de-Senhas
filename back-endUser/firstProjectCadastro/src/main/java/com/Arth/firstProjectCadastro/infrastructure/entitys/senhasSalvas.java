package com.Arth.firstProjectCadastro.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "senhasUser")
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class senhasSalvas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String Descricao;

    @Column(nullable = false, length = 1000)
    private String SenhaCrypto;

    @Column(nullable = false)
    private String iv;

    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario.email", nullable = false)
    private User usuario;
}
