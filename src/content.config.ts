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
    apoio: z.string().default('Mensagem respondida pelo próprio advogado.'),
    foto: z.enum(['principal', 'close', 'couro']).default('close'),
    avisoSimples: z.boolean().default(false),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
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
