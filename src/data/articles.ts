export type Article = {
  title: string;
  slug: string;
  category:
    | "AI és adat"
    | "Adatmunka"
    | "Tech szervezetek"
    | "Intézményi intelligencia"
    | "Munkaerőpiac"
    | "Módszertan";
  type: string;
  date: string;
  readingTime: string;
  excerpt: string;
  sourcePdfPath: string;
  href: string;
};

export const articles: Article[] = [
  {
    title: "A chatablaktól a pull requestig",
    slug: "a-chatablaktol-a-pull-requestig",
    category: "AI és adat",
    type: "Technikai bontás",
    date: "2026. jún. 27.",
    readingTime: "24 perc",
    excerpt:
      "A chatbotoktól az agentic codingig követi végig az ember és a gép közötti munkamegosztás változását. A gyorsabb kódtermelés mellett a specifikáció, az ellenőrzés és a felelősség szerepét vizsgálja.",
    sourcePdfPath: "content/ctrlplane-cikk-csomag.pdf",
    href: "/articles/a-chatablaktol-a-pull-requestig.pdf",
  },
  {
    title: "Nem a ChatGPT volt a kezdet",
    slug: "nem-a-chatgpt-volt-a-kezdet",
    category: "AI és adat",
    type: "Tudástérkép",
    date: "2026. jún. 27.",
    readingTime: "16 perc",
    excerpt:
      "A magyar nyelvtechnológia hét évtizedét mutatja be a korai gépi fordítási kísérletektől a mai magyar nyelvi modellekig. A folytonos hazai tudásépítés és a globális alapmodellekre támaszkodó új korszak kapcsolatát keresi.",
    sourcePdfPath: "content/magyar-nlp-tortenet-cikk.pdf",
    href: "/articles/nem-a-chatgpt-volt-a-kezdet.pdf",
  },
  {
    title: "Nem AI-t kell bevezetni. Működést kell áttervezni.",
    slug: "nem-ai-t-kell-bevezetni-mukodest-kell-attervezni",
    category: "Tech szervezetek",
    type: "Elemzés",
    date: "2026. jún. 22.",
    readingTime: "15 perc",
    excerpt:
      "A vállalati AI-licenc önmagában még nem transzformáció. Az írás azt bontja ki, hogyan lesz a szétszórt eszközhasználatból mérhető, biztonságos és skálázható szervezeti működés.",
    sourcePdfPath: "content/02_AI_enablement_cikk.pdf",
    href: "/articles/nem-ai-t-kell-bevezetni-mukodest-kell-attervezni.pdf",
  },
  {
    title: "AI-val gyorsabban termelünk kódot. De ki fogja átnézni?",
    slug: "ai-val-gyorsabban-termelunk-kodot-de-ki-fogja-atnezni",
    category: "Tech szervezetek",
    type: "Stratégiai elemzés",
    date: "2026. jún. 21.",
    readingTime: "22 perc",
    excerpt:
      "Az agentic coding magyar IT-vitáján keresztül vizsgálja a fejlesztés valódi szűk keresztmetszeteit. A kódgenerálás gyorsul, miközben a review, a validáció, a biztonság és a tulajdonlás terhe megmarad.",
    sourcePdfPath: "content/agentic_coding_strategiai_elemzes.pdf",
    href: "/articles/ai-val-gyorsabban-termelunk-kodot-de-ki-fogja-atnezni.pdf",
  },
  {
    title: "Nem az első hullámot kell megnyernünk",
    slug: "nem-az-elso-hullamot-kell-megnyernunk",
    category: "Intézményi intelligencia",
    type: "Vitaindító",
    date: "2026. jún. 20.",
    readingTime: "23 perc",
    excerpt:
      "Az AI 2027 és a Europe 2031 forgatókönyveit stratégiai stressztesztként olvassa Kelet-Közép-Európa számára. A régió esélyét a modellek intézményi, iparági és döntési rendszerekbe ágyazásában keresi.",
    sourcePdfPath: "content/AI2027_Europe2031_CEE_cikk.pdf",
    href: "/articles/nem-az-elso-hullamot-kell-megnyernunk.pdf",
  },
  {
    title: "Nem az AI okozta a válságot. Láthatóvá tette.",
    slug: "nem-az-ai-okozta-a-valsagot-lathatova-tette",
    category: "Munkaerőpiac",
    type: "Körkép",
    date: "2026. jún. 19.",
    readingTime: "32 perc",
    excerpt:
      "Adat- és kutatásalapú körkép a magyar IT-piacról, a juniorválságról, a senioritás inflációjáról és a bérmorálról. Az AI-t nem egyetlen okként, hanem több piaci feszültség gyorsítójaként kezeli.",
    sourcePdfPath: "content/Magyar_IT_piaci_korkep_2026.pdf",
    href: "/articles/nem-az-ai-okozta-a-valsagot-lathatova-tette.pdf",
  },
];
