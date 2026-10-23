# Gera as peças no padrão visual do escritório: faixa bege (o bege do site) de ponta a ponta no
# cabeçalho, com o logotipo oficial em dourado, e no rodapé, com os dados em dourado; corpo em Arial,
# como nas petições atuais. Usa só a biblioteca padrão do Python.
#
# Uso:
#   python scripts/gerar-modelo-peticao.py <peticao-de-origem.docx> <saida-restilizada.docx> <saida-modelo.docx>
# A primeira saída é a mesma petição com o novo cabeçalho e rodapé; a segunda, o modelo em branco.
import re
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FAIXA_CAB = RAIZ / 'identidade' / 'faixa-cabecalho.png'
FAIXA_ROD = RAIZ / 'identidade' / 'faixa-rodape.png'
LOGO_PNG = RAIZ / 'identidade' / 'logotipo-horizontal-dourado-bege-alta.png'
LOGO_SVG = RAIZ / 'identidade' / 'logotipo-horizontal-dourado-bege.svg'

# Medidas em EMU (1 cm = 360000). Folha A4: 21 x 29,7 cm.
LARGURA = 7560000
ALTO_CAB = 900000      # 2,5 cm
ALTO_ROD = 756000      # 2,1 cm
ALTO_FOLHA = 10692130  # 16838 twips
# Logotipo no cabeçalho: 5,05 x 0,86 cm, centrado na folha, na mesma altura de antes (0,81 cm do topo).
LOGO_LARGO = 1818360
LOGO_ALTO = 308881
LOGO_TOPO = 292680
OURO = '7A5D10'        # dourado sobre o bege, igual ao do site (logotipo e texto)

NS_A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
NS_PIC = 'http://schemas.openxmlformats.org/drawingml/2006/picture'


def imagem(rid, nome, id_, x, y, largo, alto, rid_svg=None):
    """Imagem ancorada na página, atrás do texto. Com rid_svg, o Word usa o vetor e os outros, o PNG."""
    svg = (f'<a:extLst><a:ext uri="{{96DAC541-7B7A-43D3-8B79-37D633B846F1}}"><asvg:svgBlip '
           f'xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="{rid_svg}"/></a:ext></a:extLst>'
           if rid_svg else '')
    return (
        f'<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" '
        f'behindDoc="1" locked="1" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/>'
        f'<wp:positionH relativeFrom="page"><wp:posOffset>{x}</wp:posOffset></wp:positionH>'
        f'<wp:positionV relativeFrom="page"><wp:posOffset>{y}</wp:posOffset></wp:positionV>'
        f'<wp:extent cx="{largo}" cy="{alto}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/>'
        f'<wp:docPr id="{id_}" name="{nome}" descr="Figueiredo Lima Advocacia"/>'
        f'<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="{NS_A}" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
        f'<a:graphic xmlns:a="{NS_A}"><a:graphicData uri="{NS_PIC}"><pic:pic xmlns:pic="{NS_PIC}">'
        f'<pic:nvPicPr><pic:cNvPr id="{id_}" name="{nome}.png"/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}">{svg}</a:blip><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{largo}" cy="{alto}"/></a:xfrm>'
        f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>'
        f'</wp:anchor></w:drawing></w:r>'
    )


# Rodapé: três linhas simples de Garamond 8 (cerca de 27 pt) no meio da faixa bege de 2,1 cm (59,5 pt). Com a
# distância do rodapé em zero, a última linha leva 17,5 pt de espaço depois, e o bloco fica centrado na vertical.
def linha_rodape(texto, depois=0):
    return (
        f'<w:p><w:pPr><w:spacing w:before="0" w:after="{depois}" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
        '<w:r><w:rPr><w:rFonts w:ascii="Garamond" w:cs="Garamond" w:eastAsia="Garamond" w:hAnsi="Garamond"/>'
        f'<w:color w:val="{OURO}"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr>'
        f'<w:t xml:space="preserve">{texto}</w:t></w:r></w:p>'
    )


# As faixas e o logotipo ficam presos ao cabeçalho, medidos a partir da página: o Google Docs respeita essa
# posição no cabeçalho, mas desloca imagens presas ao rodapé.
def novo_cabecalho(raiz_original):
    return (
        f'{raiz_original}<w:p><w:pPr><w:spacing w:after="0"/></w:pPr>'
        f'{imagem("rIdFaixaCab", "Faixa do cabeçalho", 1001, 0, 0, LARGURA, ALTO_CAB)}'
        f'{imagem("rIdLogo", "Logotipo", 1003, (LARGURA - LOGO_LARGO) // 2, LOGO_TOPO, LOGO_LARGO, LOGO_ALTO, "rIdLogoSvg")}'
        f'{imagem("rIdFaixaRod", "Faixa do rodapé", 1002, 0, ALTO_FOLHA - ALTO_ROD, LARGURA, ALTO_ROD)}</w:p></w:hdr>'
    )


def novo_rodape(raiz_original, linhas):
    corpo = ''.join(linha_rodape(t) for t in linhas[:-1])
    return raiz_original + corpo + linha_rodape(linhas[-1], depois=350) + '</w:ftr>'


RELS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/'
        'package/2006/relationships">{}</Relationships>')
IMG = ('<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
       'Target="media/{alvo}"/>')

# Cores das tabelas trocadas pelas do site (bege do fundo, bege claro e linha).
CORES = {'F3EEE2': 'F3EEE6', 'F8F5EE': 'FAF7F2', 'BFB49A': 'DDD3C3'}


def elementos_do_corpo(doc):
    """Divide o corpo em parágrafos e tabelas de primeiro nível, sem reformatar o XML."""
    ini = doc.index('<w:body>') + len('<w:body>')
    fim = doc.index('<w:sectPr')
    corpo = doc[ini:fim]
    itens, i = [], 0
    while i < len(corpo):
        m = re.compile(r'<w:(p|tbl)\b[^>]*?(/?)>').search(corpo, i)
        if not m:
            break
        if m.group(2):  # <w:p/> vazio
            itens.append(m.group(0))
            i = m.end()
            continue
        tag, prof, j = m.group(1), 1, m.end()
        padrao = re.compile(rf'<(/?)w:{tag}\b[^>]*?(/?)>')
        while prof:
            n = padrao.search(corpo, j)
            if n.group(1):
                prof -= 1
            elif not n.group(2):
                prof += 1
            j = n.end()
        itens.append(corpo[m.start():j])
        i = j
    return doc[:ini], itens, doc[fim:]


def textos(el):
    return ''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', el))


def com_texto(par, *partes):
    """Mantém a formatação do parágrafo e de cada trecho, trocando só o texto."""
    runs = re.findall(r'<w:r>.*?</w:r>', par)
    novos = []
    for k, texto in enumerate(partes):
        run = runs[min(k, len(runs) - 1)]
        novos.append(re.sub(r'<w:t[^>]*>[^<]*</w:t>', f'<w:t xml:space="preserve">{texto}</w:t>', run, count=1))
    ppr = re.search(r'<w:pPr>.*?</w:pPr>', par)
    return '<w:p>' + (ppr.group(0) if ppr else '') + ''.join(novos) + '</w:p>'


def corpo_do_modelo(itens):
    def achar(trecho):
        return next(el for el in itens if trecho in textos(el))

    ender = achar('EXCELENT')
    qualif = [el for el in itens if 'w:left="2268"' in el and el.startswith('<w:p') and textos(el)][:4]
    intro = achar('já qualificado')
    titulo = achar('CUMPRIMENTO DO JULGADO DO STJ, COM')
    razoes = achar('pelas razões de fato')
    secao = achar('I. SÍNTESE')
    subsecao = achar('II.A.')
    texto = achar('O STJ decidiu a única')
    citacao = achar('Verifica-se, portanto')
    legenda = achar('Quadro 1')
    tabela = next(el for el in itens if el.startswith('<w:tbl'))
    pedido = achar('a inclusão do feito em pauta')
    fecho = achar('Nestes termos')
    local = achar('datado e assinado')
    nome = achar('JOÃO VITOR FIGUEIREDO LIMA')
    oab = next(el for el in itens if textos(el) == 'OAB/DF 77.088')
    vazio = '<w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>'

    # Tabela de exemplo: mantém o desenho do Quadro 1 e troca o conteúdo das células.
    celulas = iter(['Coluna 1', 'Coluna 2', 'Coluna 3'] + ['[conteúdo]'] * 9)
    tabela = re.sub(r'(<w:tc>.*?<w:p>.*?)(<w:r>.*?</w:r>)+(</w:p>)',
                    lambda m: m.group(1) + re.sub(r'<w:t[^>]*>[^<]*</w:t>', f'<w:t xml:space="preserve">{next(celulas)}</w:t>', m.group(2), count=1) + m.group(3),
                    tabela, flags=re.S)

    return [
        com_texto(ender, 'EXCELENTÍSSIMO(A) SENHOR(A) [JUIZ(ÍZA) DE DIREITO / DESEMBARGADOR(A) RELATOR(A)] DA [VARA OU TURMA] DO [TRIBUNAL]'),
        com_texto(qualif[0], 'Processo n.º: ', '[número do processo]'),
        com_texto(qualif[1], 'Classe: ', '[classe processual]'),
        com_texto(qualif[2], '[POLO ATIVO]: ', '[nome]'),
        com_texto(qualif[3], '[POLO PASSIVO]: ', '[nome]'),
        com_texto(intro, '[NOME DO CLIENTE]', ', já qualificado(a) nos autos em epígrafe, por intermédio de seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, apresentar'),
        com_texto(titulo, '[TÍTULO DA PEÇA]'),
        com_texto(razoes, 'pelas razões de fato e de direito a seguir expostas.'),
        com_texto(secao, 'I. DOS FATOS'),
        com_texto(texto, '[Texto.]'),
        com_texto(secao, 'II. DO DIREITO'),
        com_texto(subsecao, 'II.A. [Subtítulo]'),
        com_texto(texto, '[Texto.]'),
        com_texto(citacao, '“[Citação de lei, doutrina ou jurisprudência, com a fonte.]”'),
        com_texto(legenda, 'Quadro 1 – [Título do quadro]'),
        tabela,
        vazio,
        com_texto(secao, 'III. DOS PEDIDOS'),
        com_texto(texto, 'Ante o exposto, requer:'),
        com_texto(pedido, 'a) ', '[pedido];'),
        com_texto(pedido, 'b) ', '[pedido].'),
        com_texto(fecho, 'Nestes termos, pede deferimento.'),
        com_texto(local, 'Brasília/DF, datado e assinado eletronicamente.'),
        vazio,
        nome,
        oab,
    ]


def gerar(origem, destino, modelo=False):
    with zipfile.ZipFile(origem) as z:
        partes = {n: z.read(n) for n in z.namelist()}

    cab = partes['word/header1.xml'].decode('utf8')
    rod = partes['word/footer1.xml'].decode('utf8')
    raiz_cab = cab[:cab.index('<w:p>')]
    raiz_rod = rod[:rod.index('<w:p>')]
    linhas = [t for t in (textos(p) for p in re.findall(r'<w:p>.*?</w:p>', rod)) if t]
    partes['word/header1.xml'] = novo_cabecalho(raiz_cab).encode('utf8')
    partes['word/footer1.xml'] = novo_rodape(raiz_rod, linhas).encode('utf8')
    partes['word/_rels/header1.xml.rels'] = RELS.format(
        IMG.format(rid='rIdFaixaCab', alvo='faixa-cabecalho.png') + IMG.format(rid='rIdFaixaRod', alvo='faixa-rodape.png')
        + IMG.format(rid='rIdLogo', alvo='logotipo.png') + IMG.format(rid='rIdLogoSvg', alvo='logotipo.svg')).encode('utf8')
    partes['word/_rels/footer1.xml.rels'] = RELS.format('').encode('utf8')
    partes['word/media/faixa-cabecalho.png'] = FAIXA_CAB.read_bytes()
    partes['word/media/faixa-rodape.png'] = FAIXA_ROD.read_bytes()
    partes['word/media/logotipo.png'] = LOGO_PNG.read_bytes()
    partes['word/media/logotipo.svg'] = LOGO_SVG.read_bytes()
    tipos = partes['[Content_Types].xml'].decode('utf8')
    if 'Extension="svg"' not in tipos:
        tipos = tipos.replace('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
                              '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
                              '<Default ContentType="image/svg+xml" Extension="svg"/>')
        partes['[Content_Types].xml'] = tipos.encode('utf8')

    doc = partes['word/document.xml'].decode('utf8')
    for velha, nova in CORES.items():
        doc = doc.replace(velha, nova)
    # Margens: o texto termina acima da faixa do rodapé, com folga.
    doc = re.sub(r'<w:pgMar [^>]*/>', '<w:pgMar w:top="1701" w:right="1134" w:bottom="1361" w:left="1701" '
                 'w:header="567" w:footer="0" w:gutter="0"/>', doc)
    if modelo:
        inicio, itens, fim = elementos_do_corpo(doc)
        doc = inicio + ''.join(corpo_do_modelo(itens)) + fim
        partes['word/comments.xml'] = re.sub(r'<w:comment\b.*</w:comment>', '', partes['word/comments.xml'].decode('utf8'), flags=re.S).encode('utf8')
    partes['word/document.xml'] = doc.encode('utf8')

    with zipfile.ZipFile(destino, 'w', zipfile.ZIP_DEFLATED) as z:
        ordem = ['[Content_Types].xml'] + [n for n in partes if n != '[Content_Types].xml']
        for n in ordem:
            z.writestr(n, partes[n])


if __name__ == '__main__':
    origem, restilizada, modelo = sys.argv[1:4]
    gerar(origem, restilizada)
    gerar(origem, modelo, modelo=True)
    print('ok')
