# language: es
@Regression
Característica: Contadores de WordCounter
  Con la configuración por defecto, el sitio muestra las palabras, los caracteres
  y las palabras más repetidas. Los números esperados están en docs/plan-y-casos-de-prueba.md.

  Antecedentes:
    Dado que abro WordCounter con la configuración por defecto

  @Smoke
  @TC_WC_001
  Escenario: El editor vacío inicia en cero
    Entonces el número de palabras es 0
    Y el número de caracteres es 0
    Y el resumen visible es "0 words 0 characters"
    Y Keyword Density no lista palabras

  @Smoke
  @TC_WC_002
  Escenario: Una palabra actualiza los tres indicadores
    Cuando pego el dato "una-palabra"
    Entonces el número de palabras es 1
    Y el número de caracteres es 5
    Y el resumen visible es "1 word 5 characters"
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | hello   | 1            | 100%       |

  @TC_WC_004
  Escenario: Los espacios repetidos cuentan como caracteres y no como palabras
    Cuando pego el dato "espacios-repetidos"
    Entonces el número de palabras es 2
    Y el número de caracteres es 13
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | hello   | 1            | 50%        |
      | world   | 1            | 50%        |

  @Smoke
  @TC_WC_003
  Escenario: El texto de la prueba muestra palabras, caracteres y el top 3
    Cuando pego el dato "texto-de-referencia"
    Entonces el número de palabras es 276
    Y el número de caracteres es 1586
    Y el resumen visible es "276 words 1,586 characters"
    Y las palabras de Keyword Density comienzan en este orden con:
      | palabra | repeticiones | porcentaje |
      | words   | 5            | 3%         |
      | word    | 5            | 3%         |
      | text    | 4            | 3%         |

  @TC_WC_005
  Escenario: Los espacios y el salto de línea no crean palabras
    Cuando pego el dato "solo-espacios"
    Entonces el número de palabras es 0
    Y el número de caracteres es 5
    Y Keyword Density no lista palabras

  @TC_WC_006
  Escenario: La puntuación sola no crea palabras
    Cuando pego el dato "solo-puntuacion"
    Entonces el número de palabras es 0
    Y el número de caracteres es 3
    Y Keyword Density no lista palabras

  @TC_WC_007
  Escenario: Borrar el texto devuelve los contadores a cero
    Cuando pego el dato "dos-palabras"
    Entonces el número de palabras es 2
    Cuando borro el texto del editor
    Entonces el número de palabras es 0
    Y el número de caracteres es 0
    Y Keyword Density no lista palabras

  @TC_WC_008
  Escenario: La densidad ignora mayúsculas y agrupa la misma palabra
    Cuando pego el dato "mayusculas"
    Entonces el número de palabras es 3
    Y el número de caracteres es 17
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | hello   | 3            | 100%       |

  @TC_WC_009
  Escenario: Las stop words se cuentan como palabras y no entran en la densidad
    Cuando pego el dato "stop-words"
    Entonces el número de palabras es 6
    Y el número de caracteres es 23
    Y Keyword Density no contiene la palabra "the"
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | cat     | 2            | 67%        |
      | dog     | 1            | 33%        |

  @TC_WC_010
  Escenario: El salto de línea separa palabras y no suma un carácter
    Cuando pego el dato "salto-de-linea"
    Entonces el número de palabras es 2
    Y el número de caracteres es 10

  @TC_WC_011
  Escenario: Un empate de repeticiones se ordena por la primera aparición
    Cuando pego el dato "empate"
    Entonces el número de palabras es 5
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | alpha   | 2            | 40%        |
      | beta    | 2            | 40%        |
      | gamma   | 1            | 20%        |

  @TC_WC_012
  Escenario: Los números cuentan como palabras y no aparecen en Keyword Density
    Cuando pego el dato "numeros"
    Entonces el número de palabras es 2
    Y el número de caracteres es 7
    Y Keyword Density no lista palabras

  @TC_WC_013
  Escenario: Una palabra con guion cuenta como una sola
    Cuando pego el dato "guion"
    Entonces el número de palabras es 1
    Y el número de caracteres es 10
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | word-count | 1         | 100%       |

  @bug
  @issue=DEF-WC-003
  @severity:critical
  @TC_WC_301
  Escenario: Una dirección web se cuenta igual abajo y a la derecha
    Cuando pego el dato "direccion-web"
    Entonces guardo la evidencia del defecto "DEF-WC-003" como "DEF-WC-003-url"
    Y el resumen visible es "3 words 23 characters"
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra      | repeticiones | porcentaje |
      | https        | 1            | 33%        |
      | example.com  | 1            | 33%        |
      | foo          | 1            | 33%        |

  @bug
  @issue=DEF-WC-003
  @severity:critical
  @TC_WC_302
  Escenario: Un correo se cuenta igual abajo y a la derecha
    Cuando pego el dato "correo"
    Entonces guardo la evidencia del defecto "DEF-WC-003" como "DEF-WC-003-correo"
    Y el resumen visible es "1 word 13 characters"
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra       | repeticiones | porcentaje |
      | user@mail.com | 1            | 100%       |

  @bug
  @issue=DEF-WC-003
  @severity:critical
  @TC_WC_303
  Escenario: word--word se cuenta igual abajo y a la derecha
    Cuando pego el dato "doble-guion"
    Entonces guardo la evidencia del defecto "DEF-WC-003" como "DEF-WC-003-doble-guion"
    Y el resumen visible es "2 words 10 characters"
    Y las palabras de Keyword Density coinciden en este orden con:
      | palabra | repeticiones | porcentaje |
      | word    | 2            | 100%       |

  @bug
  @issue=DEF-WC-003
  @severity:critical
  @TC_WC_306
  Escenario: Tres guiones no crean una palabra ni una fila
    Cuando pego el dato "solo-guiones"
    Entonces guardo la evidencia del defecto "DEF-WC-003" como "DEF-WC-003-solo-guiones"
    Y el resumen visible es "0 words 3 characters"
    Y Keyword Density no lista palabras
