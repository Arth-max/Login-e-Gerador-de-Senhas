package com.Arth.firstProjectCadastro.infrastructure.entitys;

public record GerarSenhaDTO(int tamanho, Boolean numeros, Boolean maiusculas,
                            Boolean minusculas, Boolean especiais) {
}
