export type ArticleEnhancement = {
  afterHeading: string;
  label: string;
  text?: string;
  items?: string[];
};

export const articleEnhancements: Record<string, ArticleEnhancement[]> = {
  "a-chatablaktol-a-pull-requestig": [
    {
      afterHeading: "4. Már nem kódot, hanem feladatot adunk",
      label: "A munkaegység változása",
      items: [
        "Chatbot: kérdés és válasz",
        "Copilot: kódrészlet az editorban",
        "Vibe coding: funkció vagy prototípus",
        "Agentic coding: teljes feladat vagy issue",
      ],
    },
    {
      afterHeading: "6. A gyorsabb kód nem feltétlenül jobb szoftver",
      label: "Kulcsállítás",
      text: "A generálás gyorsulása önmagában nem rövidíti le a megértés, a review és a felelősség munkáját.",
    },
  ],
  "nem-a-chatgpt-volt-a-kezdet": [
    {
      afterHeading: "A láthatatlan évtized: korpuszok",
      label: "A háttérben dolgozó infrastruktúra",
      text: "A mai magyar modellek mögött évtizedek kézzel annotált korpuszai, morfológiai eszközei és nyílt kutatási eredményei állnak.",
    },
    {
      afterHeading: "A fordulat: a nulláról tanítástól az adaptációig",
      label: "A váltás három lépése",
      items: [
        "Nyílt globális alapmodell kiválasztása",
        "Magyar adaton végzett továbbtanítás és finomhangolás",
        "Magyar feladatokon végzett mérés és ellenőrzés",
      ],
    },
  ],
  "nem-ai-t-kell-bevezetni-mukodest-kell-attervezni": [
    {
      afterHeading: "4. Az AI nem az első fázis",
      label: "Érettségi sorrend",
      items: [
        "A folyamat és a felelősség tisztázása",
        "Az adat és a determinisztikus automatizálás rendbetétele",
        "Mérhető AI-döntéstámogatás bevezetése",
        "Agentic működés csak stabil korlátok és kontroll mellett",
      ],
    },
    {
      afterHeading: "9. Mit kell mérni?",
      label: "Mérési elv",
      text: "Nem az AI-használat mennyisége számít, hanem az átfutási idő, a minőség, a hibaköltség és az üzleti eredmény változása.",
    },
  ],
  "ai-val-gyorsabban-termelunk-kodot-de-ki-fogja-atnezni": [
    {
      afterHeading: "3. Hol kezdődik a félreértés?",
      label: "Kulcsállítás",
      text: "A generálás olcsó lett. A megértés, a validáció és a felelős jóváhagyás nem.",
    },
    {
      afterHeading: "8. Mit kellene mérni?",
      label: "Hasznosabb mérőszámok",
      items: [
        "Cycle time és review lead time",
        "Change failure rate és production hibák",
        "Rework, churn és túl nagy pull requestek",
        "Tesztlefedettség és security findingok",
      ],
    },
  ],
  "nem-az-elso-hullamot-kell-megnyernunk": [
    {
      afterHeading: "3. Hol kezdődik a spekuláció?",
      label: "Olvasási keret",
      text: "A forgatókönyvek itt stratégiai stressztesztek, nem dátumhoz kötött jóslatok. Az értékük abban van, milyen felkészülési hiányokat tesznek láthatóvá.",
    },
    {
      afterHeading: "5. Mit jelent Kelet-Közép-Európának?",
      label: "A második hullám terepe",
      items: [
        "Valós intézményi és iparági bevezetés",
        "Rendezetlen adatok és örökölt rendszerek összekapcsolása",
        "Evaluation, auditálhatóság és governance",
        "Doménspecifikus AI-rendszerek építése",
      ],
    },
  ],
  "nem-az-ai-okozta-a-valsagot-lathatova-tette": [
    {
      afterHeading: "6. Produktivitásmérés az AI-korszakban",
      label: "Amit külön kell tartani",
      items: [
        "Aktivitás: mennyi munka látszik",
        "Output: mennyi eredmény készül",
        "Outcome: milyen változást okoz",
        "Üzleti érték: mit ér el a szervezet számára",
      ],
    },
    {
      afterHeading: "10. Ki lehet nyertes ebben a piacon?",
      label: "Közös minta",
      text: "Az erős pozíciót nem a puszta kódmennyiség, hanem a domainismeret, a mérnöki kontroll, a production-felelősség és az üzleti ítélőképesség adja.",
    },
  ],
};
