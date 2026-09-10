/*
 * Português — traduzido de `fr.ts`.
 *
 * RESERVA ABERTA: como o luxemburguês, esta tradução é uma primeira redação, não relida
 * por um falante nativo. O português é a língua de casa numa parte das famílias do
 * município; convém fazê-la reler.
 *
 * O vocabulário segue o da própria aplicação (`../bus-scolaire-beckerich/src/i18n/pt.json`)
 * e não o de um dicionário: «paragem» e não «parada», «morada» e não «endereço»,
 * «autocarro» e não «ónibus». Uma página de apresentação que nomeia as coisas de outra
 * maneira do que a aplicação obriga o leitor a traduzir duas vezes.
 *
 * «MUNICÍPIO» E NÃO «COMUNA», decidido em 11 de setembro de 2026. A aplicação hesita entre
 * os dois — 16 contra 9 — mas não ao acaso: diz «município» sempre que fala da INSTITUIÇÃO
 * (a independência, o plano oficial, quem o pode alterar, quem autoriza os acessos) e
 * «comuna» para o território e para a área reservada aos funcionários. Esta página só fala
 * da instituição, logo é «município» em todo o lado. O sítio oficial do Governo em
 * português usa igualmente os dois; nenhuma fonte impõe um, e é por isso uma decisão
 * escrita e não uma correção.
 *
 * «PREVALECE» E NÃO «VALE», mesma data e mesma razão: é o que a aplicação diz nas frases
 * equivalentes. Guarda «vale» para «vale o ciclo indicado na caderneta», que diz outra
 * coisa — qual das duas informações usar, e não qual dos dois documentos manda.
 *
 * DUAS EXIGÊNCIAS FIRMES, a reler antes de qualquer retoque:
 *
 *  1. Os números do cabeçalho e do fecho são OS DA CAPTURA. O leitor vê o ecrã ao lado da
 *     frase; se divergirem, é da frase que desconfia. Na aplicação em português lê-se
 *     «dentro de 16 min» — daí «16 min».
 *  2. `heros.titre` é desenhado nas miniaturas de partilha a 76 px sobre 1200 px de
 *     largura: NO MÁXIMO 24 CARACTERES POR LINHA, e `npm run assets:partage` a seguir.
 */
import type { Contenu } from './type.ts'
import {
  ADRESSE_EDITEUR,
  NOM_EDITEUR,
  URL_APP,
  URL_CREDITS,
  URL_INDEPENDANCE,
  URL_LIMITES,
} from '../config.ts'
import { CHIFFRES } from './chiffres.ts'

export const pt: Contenu = {
  langue: 'pt',
  codeLangue: 'pt',

  meta: {
    titre: 'Autocarro escolar Beckerich — os horários dos seus filhos, sem pensar nisso',
    description:
      `O plano do autocarro escolar do município de Beckerich, preparado para cada criança: ` +
      `a sua paragem, a sua hora, a sua escola. Offline, sem conta. ` +
      `Site independente, sem ligação ao município nem à escola.`,
    sansScript:
      `Esta página lê-se sem JavaScript. Só as animações e a mudança de idioma ` +
      `precisam dele.`,
  },

  general: {
    marque: 'Autocarro escolar Beckerich',
    sautContenu: 'Ir para o conteúdo',
    ouvrirApp: 'Abrir a aplicação',
    fermer: 'Fechar',
    theme: 'Tema',
    themeClair: 'Claro',
    themeSombre: 'Escuro',
    choixLangue: 'Idioma',
    bientot: 'Brevemente disponível',
  },

  heros: {
    etiquette: `Site independente · ${CHIFFRES.anneesCouvertes.join(' · ')}`,
    // 18 e 17 caracteres: abaixo do limite de 24 da miniatura de partilha.
    titre: ['O que vê às 07:25,', 'numa terça-feira.'],
    altCapture: `Ecrã inicial da aplicação: o cartão da Léa, autocarro às 07:45 no Kneppchen.`,
    lignes: [
      { valeur: '07:45', texte: 'a hora do autocarro dela, na sua paragem' },
      {
        valeur: '16 min',
        texte: 'antes de sair, já descontados os 4 minutos a pé',
        compte: true,
      },
      { valeur: 'Kneppchen', texte: 'a paragem mais próxima da sua morada' },
      { valeur: 'Léa · Noah', texte: 'um cartão por criança, pela ordem das partidas' },
    ],
    actionPrincipale: 'Abrir a aplicação',
    actionSecondaire: 'O que o site não sabe fazer',
    legende: 'Captura real · 22 de setembro de 2026, 07:25',
  },

  chiffres: {
    arrets: 'paragens servidas',
    villages: 'aldeias do município',
    langues: 'línguas, incluindo o luxemburguês',
    envoi: 'dados da família que saem sem os ter pedido',
    envoiValeur: '0',
    envoiNote:
      `Três coisas saem mesmo assim: a aplicação conta as suas páginas vistas, ativar as ` +
      `notificações guarda um identificador anónimo do aparelho num servidor enquanto durar ` +
      `a subscrição, e escrever os trajetos no Google Agenda envia à Google o nome próprio ` +
      `da criança e o nome da sua paragem. Nem a sua morada, nem os ciclos.`,
  },

  ecrans: {
    titre: 'Quatro ecrãs, e é este o produto todo.',
    note: `Capturas reais da aplicação, terça-feira, 22 de setembro de 2026, às 07:25.`,
    cartes: [
      { titre: 'O ecrã da manhã', texte: 'Uma hora por criança, e mais nada.' },
      { titre: 'A semana', texte: 'Cinco dias, e o mapa do percurso a pé.' },
      {
        titre: 'O plano oficial, copiado',
        texte: `${CHIFFRES.lignes} linhas, ${CHIFFRES.arrets} paragens, tabela a tabela.`,
      },
      {
        titre: 'Seis perguntas, uma só vez',
        texte: 'A morada decide a paragem, o ciclo decide a escola.',
      },
    ],
  },

  fonctions: {
    etiquette: 'O que lá está dentro',
    titre: 'Nove respostas para nove manhãs que não se parecem.',
    tuiles: [
      {
        icone: 'semaine',
        titre: 'A semana',
        texte: 'Os cinco dias de uma criança num ecrã.',
      },
      {
        icone: 'plan',
        titre: 'O plano oficial, copiado',
        texte: 'Com o PDF do município ao lado.',
      },
      {
        icone: 'agenda',
        titre: 'Para a sua agenda',
        texte: 'Um .ics por criança, férias já retiradas.',
      },
      {
        icone: 'alerte',
        ton: 'alerte',
        titre: 'As perturbações',
        texte: 'O trajeto cancelado desaparece do ecrã.',
      },
      {
        icone: 'imprimer',
        titre: 'A folha do frigorífico',
        texte: 'Uma página A4, a preto e branco.',
      },
      {
        icone: 'partage',
        titre: 'Partilha, QR e retoma',
        texte: 'Os avós veem o mesmo ecrã.',
      },
      {
        icone: 'repas',
        titre: 'Almoço em casa, ou não',
        texte: 'A refeição regula-se dia a dia.',
      },
      {
        icone: 'adresse',
        titre: 'Terça-feira em casa da avó',
        texte: 'Outra morada para um único dia.',
      },
      {
        icone: 'horloge',
        titre: 'A casa de acolhimento',
        texte: 'Deixado à segunda, buscado à quinta.',
      },
    ],
  },

  principes: {
    donnees: {
      etiquette: 'O primeiro princípio',
      titre: 'Nenhum dado da sua família sai do aparelho.',
      texte:
        `Sem conta, sem palavra-passe. As ${CHIFFRES.rues} ruas do município vêm dentro do ` +
        `próprio site: escrever a sua não interroga nenhum serviço de cartografia.`,
    },
    horsLigne: {
      etiquette: 'Na paragem',
      titre: 'A hora já está no ecrã, sem rede.',
      points: [
        { texte: 'Instala-se a partir do navegador, sem loja de aplicações' },
        { texte: 'Tipos de letra, horários e moradas já lá estão' },
        { texte: 'Só o mapa do percurso a pé ainda precisa de rede', ton: 'nuance' },
      ],
    },
  },

  limites: {
    titre: 'O que este site não sabe.',
    note: `seis limites, antes de lhe pedirmos que o abra`,
    items: [
      {
        titre: 'Os tempos a pé são estimados',
        texte: `Em linha reta, aumentados um terço, a 4,5 km/h. Não é um itinerário.`,
      },
      {
        titre: 'Os horários são uma transcrição',
        texte: `Em caso de divergência, prevalece o documento oficial do município.`,
      },
      {
        titre: 'O plano termina a 18 de dezembro de 2026',
        texte: `O novo campus, previsto para janeiro de 2027, vai mudar horários e percursos.`,
      },
      {
        titre: 'Uma notificação não é uma garantia',
        texte: `A escola e o município continuam a ser a via oficial de informação.`,
      },
      {
        titre: 'A procura de morada fica dentro do município',
        texte: `Fora dele, é preciso indicar a paragem, sem tempo a pé.`,
      },
      {
        titre: 'Três coisas saem mesmo assim',
        texte:
          `As páginas vistas, um identificador anónimo do aparelho se ativar as ` +
          `notificações, e o nome próprio da criança se escrever os trajetos no ` +
          `Google Agenda.`,
      },
    ],
    lien: 'Ler a página «Limites»',
  },

  independance: {
    titre: 'Este site é independente.',
    texte:
      `Foi feito por um pai, a título privado, e não tem qualquer ligação à administração ` +
      `comunal de Beckerich nem à escola. Responde apenas por si. Em caso de dúvida ou de ` +
      `divergência, prevalece o documento oficial do município.`,
    lien: 'Ver o plano oficial em kanner.beckerich.lu',
    retour: `Voltar à página inicial`,
  },

  final: {
    // Os mesmos números da captura do cabeçalho.
    surtitre: 'São 07:25.',
    heure: '07:45',
    legendeHeure: 'partida · Kneppchen',
    titreAvant: 'Faltam ',
    titreAccent: 'dezasseis minutos',
    titreApres: ' antes de sair.',
    // Sem imperativo enquanto a aplicação não estiver acessível — razão em `fr.ts`.
    chapeau:
      `Será este o ecrã da manhã: uma hora, e o tempo que falta antes de sair. Nada a ` +
      `procurar, nada a comparar, nenhuma manhã a pensar nisso.`,
    action: 'Abrir a aplicação',
    qr: 'Ou leia o código para a abrir no telemóvel',
    bientot:
      `A aplicação ainda está em desenvolvimento. Esta página descreve o que ela faz; ainda ` +
      `não conduz até lá. Entretanto, o plano oficial do município continua a ser a fonte a ` +
      `consultar.`,
  },

  pied: {
    description:
      `Os horários do autocarro escolar do município de Beckerich, preparados para cada criança. ` +
      `Site independente, sem ligação ao município nem à escola.`,
    titreSite: 'O site',
    titreProjet: 'O projeto',
    liens: {
      site: [
        { texte: 'Abrir a aplicação', url: URL_APP },
        { texte: 'Limites do site', url: URL_LIMITES },
        { texte: 'Independência', url: URL_INDEPENDANCE },
      ],
      projet: [{ texte: 'Créditos e agradecimentos', url: URL_CREDITS }],
    },
    mention: 'Feito por um pai, em Beckerich.',
    source: `Dados: plano oficial do município, ${CHIFFRES.anneesCouvertes.join(' · ')}.`,
    lienMentions: 'Menções legais',
    lienContact: 'Escrever',
    viePrivee: 'Esta página não põe cookies, não mede nada e não chama nenhum servidor.',
  },

  mentions: {
    titre: `Menções legais`,
    intro: `Esta página identifica quem publica o site. Não altera nada do resto: o site continua independente, e prevalece o documento oficial do município.`,
    editeurTitre: `Editor`,
    editeurCorps: `Este site é publicado por ${NOM_EDITEUR}, a título privado e não comercial. Não foi encomendado, validado nem revisto pela administração comunal de Beckerich, pela escola fundamental ou pela maison relais.
Morada: ${ADRESSE_EDITEUR}`,
    hebergeurTitre: `Alojamento`,
    hebergeurCorps: `O site é composto por ficheiros estáticos, servidos a partir de um servidor alugado pelo editor. Nenhum dado de visita é aí conservado.`,
    donneesTitre: `Dados pessoais`,
    donneesCorps: `Esta página não põe cookies, não mede a audiência e não faz qualquer pedido a serviços terceiros. Não é recolhido nenhum dado pessoal, pelo que não há nada a consultar, a corrigir ou a apagar. A aplicação, essa, guarda o que aí introduzir apenas no seu aparelho; a página «Limites» dela explica-o em detalhe.`,
    responsabiliteTitre: `Responsabilidade`,
    responsabiliteCorps: `Os horários apresentados são retomados do plano oficial do município e transcritos com cuidado, sem garantia de exatidão. Em caso de dúvida ou de divergência, prevalece o documento oficial do município.`,
    retour: `Voltar à página inicial`,
  },

  contact: {
    titre: `Escrever`,
    intro: `Um endereço, para assinalar um horário que não corresponde, uma apresentação que se desmancha, ou algo que falta. Por detrás está um pai, não um serviço.`,
    adresseTitre: `O endereço`,
    adresseIntro: `As mensagens chegam aqui:`,
    adresseNote: `Esta página não envia nada por si mesma: o endereço está escrito em claro, e é o seu programa de correio que trata do resto. Uma mensagem recebida fica numa caixa de correio comum enquanto servir; não é registada nem copiada para outro lado. Uma resposta pode demorar alguns dias.`,
    utileTitre: `O que ajuda`,
    utileCorps: `Para um horário que não corresponde: a linha, a paragem, o dia, e a hora que esperava.
Para uma apresentação que se desmancha: o aparelho, o navegador, e o que mostra o ecrã.
Escreva na língua que lhe vier.`,
    limitesTitre: `O que este endereço não pode fazer`,
    limitesCorps: `Não leva à comuna, nem à escola, nem à maison relais. Uma ausência a comunicar, uma inscrição, um pedido de mudança de paragem: isso dirige-se diretamente a eles, e uma mensagem enviada para aqui não lá chegará.
Vale o plano oficial da comuna. Se este site o mostrar de outra maneira, é este site que está errado — e é exatamente isso que vale a pena assinalar.`,
    retour: `Voltar à página inicial`,
  },
}
