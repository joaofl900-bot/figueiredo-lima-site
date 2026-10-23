# Identidade visual e padrão de peças: Figueiredo Lima Advocacia

Recomendação interna, atualizada em 23/10/2026 (padrão bege). Vale para **toda petição, parecer, notificação, contrato ou outro documento** produzido pelo escritório, inclusive os redigidos com o Claude.

Esta pasta não faz parte do site público: nada aqui é publicado em figueiredolima.adv.br.

## 1. Cores

| Uso | Cor | Hex |
|---|---|---|
| Fundo da identidade (faixas das peças, cabeçalho e rodapé do site) | Bege do site | `#F3EEE6` |
| Dourado sobre o bege (logotipo, texto do rodapé, fio do cabeçalho) | Dourado do site | `#7A5D10` |
| Fundo escuro (topos das páginas do site, perfis escuros) | Preto do site | `#1B1814` |
| Dourado sobre o preto | Dourado claro | `#C9A54A` |
| Fundo de quadros e destaques nas peças | Bege | `#F3EEE6` |
| Linhas de quadros | Linha bege | `#DDD3C3` |
| Texto | Preto | automático |

Regra: sobre o bege, o dourado é sempre `#7A5D10`; sobre o preto, sempre `#C9A54A`. Não misturar os dois tons no mesmo fundo.

## 2. Logotipo

O desenho do logotipo é único e **não pode ser alterado, recortado nem virar monograma**. Muda apenas o tom do dourado conforme o fundo.

| Arquivo | Quando usar |
|---|---|
| `logotipo-quadrado-bege.png`, `logotipo-horizontal-bege.png` | Padrão: perfis, assinaturas de e-mail e documentos (fundo bege já aplicado) |
| `logotipo-quadrado-dourado-bege.png`, `logotipo-horizontal-dourado-bege.png` | Sobre fundo bege ou branco (PNG transparente, dourado `#7A5D10`) |
| `logotipo-horizontal-dourado-bege.svg`, `logotipo-horizontal-dourado-claro.svg` | Versão vetorial: nítida em qualquer tamanho. Usar em gráfica, papelaria e documentos |
| `logotipo-horizontal-dourado-bege-alta.png` | PNG de 2.000 px gerado do vetor; é o que vai nas peças |
| `logotipo-quadrado-preto.png`, `logotipo-horizontal-preto.png` | Só quando o fundo precisar ser escuro |
| `logotipo-quadrado-dourado-claro.png`, `logotipo-horizontal-dourado-claro.png` | Sobre qualquer fundo escuro (PNG transparente, dourado `#C9A54A`) |
| `logotipo-quadrado-transparente.png`, `logotipo-horizontal-transparente.png` | Dourado original do arquivo de origem, só para referência |

Para gerar de novo: `node scripts/vetorizar-logotipo.mjs` (cria os SVG a partir do logotipo oficial, sem mudar o desenho) e depois `node scripts/gerar-logotipos.mjs` (grava as demais versões, as faixas e o logotipo do site em `src/assets/logo-dourado-bege.png`).

## 3. Modelo de peça: `modelo-peticao-figueiredo-lima.docx`

Toda peça nova parte deste arquivo. Ele já traz o cabeçalho e o rodapé; só o corpo muda.

**Página:** A4, fundo branco. Margens: superior 3 cm, esquerda 3 cm, direita 2 cm, inferior 2,4 cm (o texto não encosta na faixa do rodapé). Distância do cabeçalho 1 cm; distância do rodapé 0 (é o que deixa a faixa colada na borda e o texto no meio dela).

**Cabeçalho:** faixa bege `#F3EEE6` de ponta a ponta da folha (2,5 cm), com fio dourado embaixo (`faixa-cabecalho.png`, atrás do texto), e o logotipo em dourado `#7A5D10` no centro, como imagem própria de 5,05 x 0,86 cm a 0,81 cm do topo.

**Qualidade do logotipo:** o logotipo não fica dentro da faixa. O Google Docs reduz imagens largas para cerca de 2.000 pixels, e dentro da faixa de 21 cm ele ficava pixelado no zoom. Como imagem própria, entra com 2.000 px em 5 cm, cerca de 1.000 dpi, sem perda. No Word, a peça usa também o SVG vetorial, e o PDF sai com o logotipo em vetor. Conferido em 23/10/2026: o PDF do Google Docs manteve os 2.000 px.

**Rodapé:** faixa toda bege, sem fio, de ponta a ponta e colada na borda de baixo (2,1 cm, `faixa-rodape.png`), com três linhas em Garamond 8, dourado `#7A5D10`, centralizadas na horizontal e na vertical: endereço completo, telefone e e-mail, nome e OAB. Entrelinha simples; a última linha tem 17,5 pt de espaço depois, o que põe o bloco no meio da faixa.

As duas faixas e o logotipo ficam presos ao **cabeçalho**, com posição medida a partir da página. Assim o Word e o Google Docs mostram o rodapé igual (o Google Docs desloca imagens presas ao rodapé e deixava uma tira branca embaixo). Testado com exportação em PDF pelo Google Docs em 23/10/2026.

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

A versão com faixas pretas (outubro de 2026) foi substituída por esta e fica só no histórico do Git (commit e9e27ab).

## 4. Como criar uma peça nova (inclusive pelo Claude)

1. Copiar `modelo-peticao-figueiredo-lima.docx` e dar o nome da peça.
2. Substituir os campos entre colchetes e o corpo, reaproveitando a formatação de cada tipo de parágrafo do modelo (no Word: copiar o parágrafo de exemplo e trocar o texto; no XML: manter o `w:pPr` e o `w:rPr` do parágrafo de exemplo).
3. Não alterar cabeçalho, rodapé, margens nem fontes.
4. Conferir as normas citadas no acervo de leis e na jurisprudência antes de entregar, e seguir o Código de Ética e o Provimento 205/2021 da OAB.
5. Gerar o PDF para protocolo (Google Docs ou Word: Arquivo > Fazer download > PDF).

Dados de clientes e peças reais **não** entram neste repositório; aqui fica só o modelo em branco.

Para refazer o modelo a partir de uma petição de origem: `python scripts/gerar-modelo-peticao.py <origem.docx> <saida-restilizada.docx> <saida-modelo.docx>` (rodar antes `node scripts/gerar-logotipos.mjs`, que gera as faixas).
