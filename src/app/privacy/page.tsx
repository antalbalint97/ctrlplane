import type { Metadata } from "next";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";

export const metadata: Metadata = {
  title: "Adatvédelem | CtrlPlane",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const controller = "Antal Bálint egyéni vállalkozó";
  const address = "2112 Veresegyház, Viczián u. 14.";
  const contact = "info@meniva.net";
  return (
    <main className="ds-container ds-container--content cp-section">
      <h1>Adatvédelmi tájékoztató</h1>
      <p>Hatályos: 2026. szeptember 10.</p>
      <p>A tájékoztató a ctrplane.com weboldal használatára és a CtrlPlane hírlevélre történő feliratkozásra vonatkozik.</p>
      <section aria-labelledby="privacy-controller">
          <h2 id="privacy-controller">Adatkezelő és kapcsolattartás</h2>
          <p>Adatkezelő: {controller}<br />Cím: {address}<br />Kapcsolattartás: <a href={`mailto:${contact}`}>{contact}</a></p>
          <p>Erre az e-mail-címre küldheted a leiratkozási, hozzáférési, helyesbítési és törlési kérelmedet is.</p>
      </section>

      <h2>CtrlPlane hírlevél</h2>
      <p>A feliratkozáskor megadott e-mail-címedet a CtrlPlane hírlevelének és az új írásokról szóló értesítéseknek a küldéséhez kezeljük. A hírlevél várhatóan kéthetente, szerkesztői kontroll mellett készül.</p>
      <p>Az adatkezelés jogalapja a hozzájárulásod, a GDPR 6. cikk (1) bekezdés a) pontja alapján. A kifejezetten hírlevél-feliratkozásra szolgáló gomb megnyomásával adsz hozzájárulást ehhez a célhoz; az analitikai mérésről külön dönthetsz. A feliratkozás önkéntes, az oldal írásait nélküle is elolvashatod. E-mail-cím nélkül a hírlevél kézbesítése nem lehetséges.</p>
      <p>Az e-mail-cím mellett a feliratkozás időpontját, forrását, állapotát és a hozzájárulási szöveg verzióját tároljuk. Ha a hivatkozás tartalmaz kampányazonosítókat, a forrást, médiumot és kampányt is rögzítjük. Ezekből látható például, hogy egy LinkedIn-bejegyzésről érkeztél.</p>
      <p>A nyilvántartás tartalmazza a levelezőszolgáltatónál létrejött kontakt azonosítóját és a szinkronizáció állapotát, időpontját is. A feliratkozási rekordhoz IP-címet nem mentünk, és a feliratkozáskor megadott e-mail-címet nem küldjük a Google Analytics vagy a Google Tag Manager mérési eseményeibe.</p>

      <h2>Leiratkozás és adatmegőrzés</h2>
      <p>Az e-mail-címedet a hírlevél küldéséhez a hozzájárulásod visszavonásáig vagy a hírlevélszolgáltatás megszűnéséig használjuk. A hozzájárulás visszavonása nem érinti a korábbi adatkezelés jogszerűségét.</p>
      <p>Leiratkozáshoz írj a <a href={`mailto:${contact}?subject=CtrlPlane%20leiratkoz%C3%A1s`}>{contact}</a> címre a feliratkozáskor megadott e-mail-címedről. A kérelmeket szerkesztői kontroll mellett dolgozzuk fel.</p>
      <p>A leiratkozás nem azonos az adatok törlésével: a feliratkozási rekord leiratkozott állapotban megmarad, hogy a címet ne aktiváljuk újra automatikusan. Ez a nyilvántartás a leiratkozás tiszteletben tartását szolgálja, és a szolgáltatás fennállásáig lehet rá szükség. A törlést külön is kérheted; a kérelem elbírálásakor megvizsgáljuk, fennáll-e további adatmegőrzést indokoló kötelezettség vagy jogalap. A leiratkozási tiltás fenntartásának jogalapja az adatkezelő jogos érdeke, a GDPR 6. cikk (1) bekezdés f) pontja alapján; ezzel szemben tiltakozhatsz.</p>

      <h2>A weboldal működtetése</h2>
      <p>A weboldal és a feliratkozási végpont kiszolgálásakor a tárhelyszolgáltató technikai adatokat dolgoz fel, például IP-címet, a kérés időpontját, a kért útvonalat és böngészőadatokat. A biztonságos működtetés és a hibák kivizsgálása az adatkezelő jogos érdeke, a GDPR 6. cikk (1) bekezdés f) pontja alapján. A feliratkozási kérés teljes tartalmát és e-mail-címét az alkalmazás nem írja az üzemeltetési naplóba.</p>
      <p>A technikai adatok megőrzését a kérés kiszolgálásához, az üzemeltetési hiba vagy biztonsági esemény kivizsgálásához szükséges idő, valamint a tárhelyszolgáltató naplómegőrzési beállításai határozzák meg. Az alkalmazás ezekből nem épít külön látogatói nyilvántartást.</p>

      <h2>Analitika és böngészőbeli tárolás</h2>
      <p>Az oldal a Google Tag Manageren keresztül Google Analytics 4 mérést használ, kizárólag az analitikai hozzájárulásod után. A mérés az oldalak olvasottságát, a hivatkozások és gombok használatát, valamint a kampányok eredményességét mutatja. A mért adatokhoz böngészőazonosítók kapcsolódhatnak, ezért ezeket nem tekintjük feltétlenül anonim adatoknak. A jogalap a külön megadott hozzájárulásod.</p>
      <p>A CtrlPlane a Meniva ökoszisztéma közös mérési rendszerét használja; az eseményeket webhely- és márkaazonosító különbözteti meg. Hirdetési célú tároláshoz és személyre szabott hirdetésekhez nem kérünk hozzájárulást, ezeket a hozzájárulási beállítások tiltják. A hírlevél-feliratkozás az analitika engedélyezése nélkül is működik.</p>
      <ul>
        <li>Az analitikai döntést a böngésző helyi tárolója őrzi meg a módosításáig vagy a webhelyadatok törléséig.</li>
        <li>Hozzájárulás után a kampány- és mérési munkamenet adatai a böngésző munkamenet-tárolójába kerülhetnek, a munkamenet idejére.</li>
        <li>A Google Analytics saját sütiket is használhat. Ezek működéséről és alapértelmezett élettartamáról a <a href="https://support.google.com/analytics/answer/11397207?hl=hu">Google sütitájékoztatója</a>, az eseményszintű adatok megőrzéséről a <a href="https://support.google.com/analytics/answer/7667196?hl=hu">Google adatmegőrzési leírása</a> ad tájékoztatást.</li>
      </ul>
      <p>A hozzájárulásodat bármikor módosíthatod vagy visszavonhatod a „Süti beállítások” gombbal. A korábban elhelyezett sütiket és helyi adatokat a böngésződ webhelyadat-beállításaiban is törölheted.</p>
      <p>A mérési adatok megőrzését a Google Analytics tulajdonhoz beállított adatmegőrzési idő és az azonosítók érvényessége határozza meg; az összesített jelentések ettől eltérő ideig maradhatnak elérhetők. Az aktuális beállításokról a fenti kapcsolattartási címen kérhetsz tájékoztatást.</p>
      <PrivacySettingsButton />

      <h2>Igénybe vett szolgáltatók</h2>
      <ul>
        <li><strong>Vercel Inc.</strong>: a weboldal és a feliratkozási végpont tárhelye, technikai kiszolgálás. <a href="https://vercel.com/legal/dpa">Adatfeldolgozási feltételek</a>.</li>
        <li><strong>MongoDB, Inc. — MongoDB Atlas</strong>: a feliratkozói nyilvántartás felhőalapú tárolása. <a href="https://www.mongodb.com/legal/data-processing-agreement">Adatfeldolgozási feltételek</a>.</li>
        <li><strong>Plus Five Five, Inc. — Resend</strong>: a feliratkozói kontaktok kezelése és a hírlevelek kézbesítése. <a href="https://resend.com/legal/dpa">Adatfeldolgozási feltételek</a>.</li>
        <li><strong>Google — Google Analytics és Google Tag Manager</strong>: hozzájáruláshoz kötött használati mérés. <a href="https://policies.google.com/privacy?hl=hu">Adatvédelmi tájékoztató</a> és <a href="https://business.safety.google/adsprocessorterms/">adatfeldolgozási feltételek</a>.</li>
      </ul>
      <p>E szolgáltatók és alvállalkozóik az Európai Gazdasági Térségen kívül, így az Egyesült Államokban is végezhetnek adatkezelést. A szolgáltatók adatfeldolgozási feltételei tartalmazzák a nemzetközi adattovábbítás garanciáit, ideértve az alkalmazandó megfelelőségi határozatokat vagy az Európai Bizottság által elfogadott általános szerződési feltételeket. A fenti hivatkozásokon ezek megismerhetők; további tájékoztatást az adatkezelőtől kérhetsz.</p>

      <h2>A jogaid és a kérelmek kezelése</h2>
      <p>Kérheted a személyes adataidhoz való hozzáférést, azok helyesbítését, törlését, az adatkezelés korlátozását, illetve az alkalmazandó feltételek mellett az adathordozhatóságot. Jogos érdeken alapuló adatkezeléssel szemben tiltakozhatsz, a hozzájárulásodat pedig visszavonhatod. A kérelmedre főszabály szerint egy hónapon belül válaszolunk; indokolt hosszabbításról ezen időn belül tájékoztatunk. Kétség esetén kizárólag a személyazonosság ellenőrzéséhez szükséges további információt kérjük.</p>
      <p>A hírlevél-feliratkozás kapcsán nem alkalmazunk rád nézve joghatással vagy hasonlóan jelentős hatással járó automatizált döntéshozatalt.</p>

      <h2>Panasz és jogorvoslat</h2>
      <p>Adatkezelési panaszoddal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz fordulhatsz: 1055 Budapest, Falk Miksa utca 9–11.; <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>; <a href="https://www.naih.hu/ugyfelszolgalat-kapcsolat">NAIH elérhetőségek</a>. A jogaid védelmében bírósághoz is fordulhatsz.</p>
      <p>Jogi háttér: <a href="https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32016R0679">az általános adatvédelmi rendelet (GDPR)</a>.</p>
    </main>
  );
}

