import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatvédelem | CtrlPlane",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const controller = process.env.PRIVACY_CONTROLLER_NAME;
  const contact = process.env.PRIVACY_CONTACT_EMAIL;
  return (
    <main className="ds-container ds-container--content cp-section">
      <h1>Adatvédelmi tájékoztató</h1>
      {controller && contact ? <p>Adatkezelő: {controller}. Adatkezelési kérdés, leiratkozás vagy törlési kérés: <a href={`mailto:${contact}`}>{contact}</a>.</p> : null}
      <h2>CtrlPlane hírlevél</h2>
      <p>A feliratkozáskor megadott e-mail-címedet a CtrlPlane hírlevelének és az új írásokról szóló értesítéseknek a küldéséhez kezeljük. A hírlevél várhatóan kéthetente, szerkesztői kontroll mellett készül.</p>
      <p>A feliratkozás önkéntes. A kifejezetten hírlevél-feliratkozásra szolgáló gomb megnyomásával adsz hozzájárulást ehhez a célhoz; az analitikai méréshez külön döntés szükséges.</p>
      <p>Az e-mail-cím mellett a feliratkozás időpontját, forrását, állapotát és a hozzájárulási szöveg verzióját tároljuk. Ha a hivatkozás tartalmaz kampányazonosítókat, a forrást, médiumot és kampányt is rögzítjük. Ezekből látható például, hogy egy LinkedIn-bejegyzésről érkeztél.</p>
      <p>A feliratkozói nyilvántartást MongoDB Atlasban tároljuk. A levelezési és kapcsolatszinkronizációs szolgáltató a Resend; a szinkronizáció bekapcsolásakor az e-mail-címet és a kapcsolódó feliratkozási állapotot adjuk át neki. Az e-mail-cím nem kerül az oldal analitikai eseményeibe.</p>
      <p>A hírlevél küldése a hozzájárulás visszavonásáig tart. A leiratkozott címet nem aktiváljuk újra automatikusan. Kérheted az adataidhoz való hozzáférést, azok helyesbítését vagy törlését, és visszavonhatod a hozzájárulásodat.</p>
      <h2>Analitika</h2>
      <p>A CtrlPlane kizárólag a hozzájárulásod után tölt be analitikai mérést. Hirdetési célú tárolást nem használunk, és a mérési eseményekbe nem küldünk nevet, e-mail-címet vagy szabad szöveges tartalmat.</p>
      <p>A hozzájárulásodat bármikor módosíthatod vagy visszavonhatod a „Süti beállítások” gombbal.</p>
    </main>
  );
}

