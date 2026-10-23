// Coleções de conteúdo: as áreas de atuação (arquivos .yaml) e os artigos (arquivos .md,
// escritos pelo editor Pages CMS). O "schema" confere cada arquivo na hora de publicar:
// se faltar um campo obrigatório, a publicação para e avisa, em vez de ir ao ar quebrada.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const item = z.object({ titulo: z.string(), texto: z.string().optional() });

const areas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/areas' }),
  schema: z.object({
    ordem: z.number(),
    principal: z.boolean().default(false),
    nome: z.string(),
    resumoCard: z.string(),
    listaCard: z.array(z.string()).optional(),
    chamadaCard: z.string().default('Saiba mais'),
    seoTitulo: z.string(),
    seoDescricao: z.string(),
    sobretitulo: z.string(),
    h1: z.string(),
    abertura: z.string(),
    botao: z.string(),
    mensagemWhatsApp: z.string(),
    linkSecundario: z.object({ rotulo: z.string(), href: z.string() }).optional(),
    // Frase que acompanha "Eu mesmo leio e respondo cada mensagem." no topo da página.
    apoio: z.string().default('Escritório no Lago Norte, em Brasília, com atendimento presencial com horário marcado.'),
    foto: z.enum(['principal', 'close', 'couro']).default('close'),
    avisoSimples: z.boolean().default(false),
    // A apresentação a partir da dor do cliente: quatro quadros (o problema, o risco, a saída e como atuo)
    // e o fechamento, com a frase-síntese e o que o serviço inclui (se faltar, usa as frentes).
    historiaTitulo: z.string(),
    historia: z.array(item).length(4),
    fecho: z.object({ frase: z.string(), texto: z.string().optional(), itens: z.array(z.string()).optional() }),
    situacoesIntro: z.string().optional(),
    situacoes: z.array(item),
    frentesTitulo: z.string().default('Como atuo'),
    frentesIntro: z.string().optional(),
    frentes: z.array(item),
    destaque: z.object({
      id: z.string(),
      sobretitulo: z.string(),
      titulo: z.string(),
      paragrafos: z.array(z.string()),
      nota: z.string().optional(),
      itens: z.array(z.string()),
    }).optional(),
    documentos: z.array(z.string()),
    etapas: z.array(item).optional(),
    faqTitulo: z.string().default('Perguntas frequentes'),
    faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })),
    chamadaTitulo: z.string(),
    chamadaTexto: z.string(),
    avisoRodape: z.string().optional(),
  }),
});

// Áreas válidas para classificar um artigo (o mesmo nome do arquivo da área).
const AREAS = ['tributario', 'planos-de-saude', 'consumidor', 'leiloes-de-imoveis', 'direito-publico', 'civel'] as const;

const artigos = defineCollection({
  // O endereço do artigo vem do nome do arquivo, sem acentos e com hífens
  // ("Débitos no Simples.md" vira /artigos/debitos-no-simples/), mesmo que o editor grave acentos.
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/artigos',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    area: z.enum(AREAS),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Enquanto "draft" for verdadeiro, o artigo não aparece no site.
    draft: z.boolean().default(false),
  }),
});

export const collections = { areas, artigos };
