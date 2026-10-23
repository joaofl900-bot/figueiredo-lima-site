# Identidade visual e padrão de peças: Figueiredo Lima Advocacia

Recomendação interna, aprovada em 23/10/2026. Vale para **toda petição, parecer, notificação, contrato ou outro documento** produzido pelo escritório, inclusive os redigidos com o Claude.

Esta pasta não faz parte do site público: nada aqui é publicado em figueiredolima.adv.br.

## 1. Cores

| Uso | Cor | Hex |
|---|---|---|
| Fundo escuro (faixas, topo do site) | Preto do site | `#1B1814` |
| Dourado sobre fundo escuro (logotipo, rodapé, fios) | Dourado claro | `#C9A54A` |
| Dourado sobre fundo claro (logotipo original) | Dourado original | `#8B6A14` |
| Fundo claro de quadros e destaques | Bege | `#F3EEE6` |
| Linhas de quadros | Linha bege | `#DDD3C3` |
| Texto | Preto | automático |

Regra: sobre o preto, o dourado é sempre `#C9A54A`; sobre o claro, o dourado original. Não misturar os dois tons no mesmo fundo.

## 2. Logotipo

O desenho do logotipo é único e **não pode ser alterado, recortado nem virar monograma**. Muda apenas o tom do dourado conforme o fundo.

| Arquivo | Quando usar |
|---|---|
| `logotipo-quadrado-preto.png` | Perfis e documentos com fundo escuro (quadrado) |
| `logotipo-horizontal-preto.png` | Cabeçalhos e assinaturas de e-mail com fundo escuro |
| `logotipo-quadrado-dourado-claro.png`, `logotipo-horizontal-dourado-claro.png` | Sobre qualquer fundo escuro (PNG transparente) |
| `logotipo-quadrado-transparente.png`, `logotipo-horizontal-transparente.png` | Sobre fundo claro (dourado original, PNG transparente) |

Para gerar de novo: `node scripts/gerar-logotipo-preto.mjs`.

## 3. Modelo de peça: `modelo-peticao-figueiredo-lima.docx`

Toda peça nova parte deste arquivo. Ele já traz o cabeçalho e o rodapé; só o corpo muda.

**Página:** A4. Margens: superior 3 cm, esquerda 3 cm, direita 2 cm, inferior 2,4 cm (o texto não encosta na faixa do rodapé).

**Cabeçalho:** faixa preta de ponta a ponta da folha (2,5 cm), com o logotipo em dourado claro no centro e fio dourado embaixo (`faixa-cabecalho.png`, atrás do texto).

**Rodapé:** faixa preta de ponta a ponta (2,1 cm), fio dourado em cima (`faixa-rodape.png`) e três linhas em Garamond 8, dourado `#C9A54A`, centralizadas: endereço completo, telefone e e-mail, nome e OAB.

**Corpo (Arial):**

| Elemento | Formatação |
|---|---|
| Endereçamento | 12, negrito, justificado, entrelinha 1,25, 18 pt depois |
| Qualificação (processo, classe, partes) | 11, recuo esquerdo 4 cm, rótulo em negrito, entrelinha 1,17, 2 pt depois (18 pt no último) |
| Abertura | 12, recuo de primeira linha 2 cm, entrelinha 1,5, nome do cliente em negrito |
| Título da peça | 12, negrito, centralizado, maiúsculas |
| Texto | 12, justificado, recuo de primeira linha 2 cm, entrelinha 1,5, 6 pt depois |
| Seção (I., II., III.) | 12, negrito, maiúsculas, 18 pt antes, 8 pt depois, manter com o próximo |
| Subseção (II.A.) | 12, negrito, 10 pt antes, 6 pt depois |
| Citação | 10,5, recuo esquerdo 4 cm, entrelinha 1,08, entre aspas, com a fonte |
| Quadro | legenda 10 negrito centralizada ("Quadro 1 – ..."); células 9,5; cabeçalho com fundo bege `#F3EEE6`; linhas `#DDD3C3` |
| Pedidos | alíneas "a)", "b)" em negrito, recuo deslocado 1 cm, entrelinha 1,5 |
| Fecho | "Nestes termos, pede deferimento." e "Brasília/DF, datado e assinado eletronicamente." |
| Assinatura | JOÃO VITOR FIGUEIREDO LIMA (negrito, centralizado) e OAB/DF 77.088 |

**Parecer:** mesmo cabeçalho, rodapé e formatação. Troca-se o endereçamento e a qualificação por "PARECER JURÍDICO", destinatário (consulente), assunto e data, e as seções por: I. Consulta; II. Análise; III. Conclusão. A assinatura é a mesma.

**Outros documentos** (notificação, contrato, declaração): mesmo cabeçalho, rodapé e corpo em Arial 12, com as seções que o documento pedir.

## 4. Como criar uma peça nova (inclusive pelo Claude)

1. Copiar `modelo-peticao-figueiredo-lima.docx` e dar o nome da peça.
2. Substituir os campos entre colchetes e o corpo, reaproveitando a formatação de cada tipo de parágrafo do modelo (no Word: copiar o parágrafo de exemplo e trocar o texto; no XML: manter o `w:pPr` e o `w:rPr` do parágrafo de exemplo).
3. Não alterar cabeçalho, rodapé, margens nem fontes.
4. Conferir as normas citadas no acervo de leis e na jurisprudência antes de entregar, e seguir o Código de Ética e o Provimento 205/2021 da OAB.
5. Gerar o PDF para protocolo (Google Docs ou Word: Arquivo > Fazer download > PDF).

Dados de clientes e peças reais **não** entram neste repositório; aqui fica só o modelo em branco.

Para refazer o modelo a partir de uma petição de origem: `python scripts/gerar-modelo-peticao.py <origem.docx> <saida-restilizada.docx> <saida-modelo.docx>`.
