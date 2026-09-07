package com.Arth.firstProjectCadastro.infrastructure.entitys;

public record gerarSenhaDTO(int tamanho, Boolean numero, Boolean maiusculas,
                            Boolean minusculas, Boolean especiais) {
}
