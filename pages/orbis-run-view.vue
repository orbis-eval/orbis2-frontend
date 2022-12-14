<template>
  <div class="bg-gray-900  h-screen p-8 text-gray-400 ">
    <div class="grid grid-cols-[1fr_7fr_2fr] grid-rows-[1fr_10fr_1fr] gap-1 h-full">
      <header class="col-span-full tile p-4 border border-gray-600">
        <!-- Header -->
        Header
      </header>
      <nav class="tile border border-gray-600">
        <!-- Dropdown for Run-Select -->
        <RunSelect
            :runs="runs"
            @runSelect="runSelect"/>
        <!-- Menu Entries -->
        <LeftMenuRun/>
      </nav>
      <main class="tile p-4 border border-gray-600">
        <!-- Main Content -->
        Main-Content

        <component :is="currentComponent"
            :documents="currentDocuments"
        />

      </main>
      <aside class="tile p-4 border border-gray-600">
        <!-- Sidebar -->
        Side-Bar
      </aside>
      <footer class="col-span-full tile p-4 border border-gray-600">
        <!-- Footer -->
        Footer
      </footer>
    </div>
  </div>
</template>

<script setup>

import DocumentList from '@/components/DocumentList.vue'

// dummy functions that simulates returning all runs and its documents for a corpus
const getRuns = () => {
  return [
    {
      id: 1,
      name: 'Run 1',
      documents: [
        {
          id: 1,
          name: 'Vacancy: Ärztin Teilzeit 40 - 60',
          content: `
          Tox Info Suisse (www.toxinfo.ch) betreibt in der Schweiz die Notrufnummer 145. Ärztinnen und Ärzte
  sowie weitere medizinische Fachpersonen geben täglich rund um die Uhr telefonisch Auskunft bei
  Vergiftungen durch Chemikalien, Medikamente, giftige Pflanzen, Pilze oder Tiere sowie Drogen und
  vieles mehr.


  An unserem Standort, mitten im Herzen von Zürich mit unseren gegen 50 Mitarbeitenden, bieten wir
  per Juni 2022 oder auch früher, einer medizinisch versierten, aufgeschlossenen Persönlichkeit eine
  interessante Stelle und ein abwechslungsreiches Aufgabengebiet als


  Ärztin/Arzt in Teilzeit 40-60%


  Zu den Aufgaben gehören im Wesentlichen:

    * Telefonische Beratung von medizinischen Fachpersonen und Laien bei Vergiftungen und
      Arzneimittelnebenwirkungen und Aufarbeitung der ärztlichen Rückmeldungen
    * Kontrolle/Verfassen von internen Beratungsdokumenten
    * Aufarbeiten von Datenmaterial
    * Aktive Teilnahme an der internen Fortbildung

  Sie erhalten zudem an dieser Stelle eine vielseitige Ausbildung in Klinischer Toxikologie und
  Vergiftungsberatung.


  Die Anforderungen an die/den zukünftigen StelleninhaberIn sind:

    * Abgeschlossenes Medizinstudium
    * Engagierte, patientenorientierte Arbeitsweise und hohes Verantwortungsbewusstsein
    * Erfahrung im klinisch-toxikologischen Umfeld von Vorteil jedoch nicht Bedingung
    * Gute Kommunikationsfähigkeiten in den Sprachen Deutsch, Französisch und Englisch in
      Wort und Schrift ist Bedingung
    * Einwandfreie Umgangsformen, Einfühlungsvermögen und Dienstleistungsmentalität

  Unser Angebot richtet sich ausdrücklich auch an Wiedereinsteigerinnen und Wiedereinsteiger, welche
  sich für eine längerfristige Tätigkeit in unserer Institution begeistern können.


  Haben wir Ihr Interesse geweckt? Dann freuen wir uns über die Einreichung Ihrer vollständigen
  Bewerbungsunterlagen (Lebenslauf, Aus- und Weiterbildungszertifikate, Arbeitszeugnisse) an
  hr@toxinfo.ch


  Auskünfte zu dieser Stellenausschreibung erteilt Ihnen gerne unsere Leitende Ärztin Dr. med. Cornelia
  Reichert unter Telefon 044 251 66 66.


  Wir freuen uns, Sie kennen zu lernen.


  Hinweis: Bewerbungen, welche uns zu dieser Stellenausschreibung auf dem Postweg zugestellt werden, können
  wir aus administrativen Gründen nicht an die Bewerber zurücksenden. Die Unterlagen werden unter Einhaltung
  des DSG durch die Empfängerin (Tox Info Suisse) nach Abschluss des Prozesses passend vernichtet.
      `
        },
        {
          id: 2,
          name: 'Vacancy: Umzugs- und Zügelaushilfen',
          content: `
  Weber-Vonesch Transport AG – Qualitätsumzüge weltweit


  Die Weber-Vonesch Transport AG in Zug ist ein etabliertes Unternehmen
  mittlerer Größe, welches im Bereich Umzüge Schweiz und weltweit seit
  Jahrzehnten erfolgreich tätig ist. Für unsere zunehmenden Aufträge brauchen
  wir Verstärkung und suchen:


  Umzugs- und Zügelaushilfen


  Sind Sie Student, Landwirt, Handwerker oder selbständig Erwerbender und
  wollen uns bei Einsätzen als Umzugsmitarbeiter gelegentlich, nach
  gegenseitiger Vereinbarung, unterstützen?


  Gute Deutschkenntnisse, gepflegte Umgangsformen, gewisses handwerkliches
  Flair und eine gute körperliche Verfassung sind die Grundvoraussetzungen.
  Von Vorteil ist ein Führerschein Kat. B. Zeitlich bringen Sie eine gewisse
  Flexibilität mit, denn unsere Aufträge sind jeden Tag unterschiedlich lang.


  Herr Michael Fürrer gibt Ihnen gerne weitere Auskünfte. Bitte senden Sie Ihre
  Bewerbungsunterlagen per Email an folgende Adresse:
  bewerbung@weber-vonesch.ch


  Weber-Vonesch Transport AG
  Personalabteilung
  Chollerstrasse 3
  6300 Zug
  Tel. 041 747 44 44
  bewerbung@weber-vonesch.ch
  www.weber-vonesch.ch


  Wir freuen uns auf Ihre Kontaktaufnahme!
      `
        },
        {
          id: 3,
          name: 'Vacany: Online Marketing Manager',
          content: `
   Online Marketing Jobs


  Online Marketing
  Jobs bei unseren Partnern


  Our partner wants you!


  Online Marketing Manager


  Unser Partner, ein renommiertes Industrieunternehmen, welches im Bereich Reinraumzubehör tätig ist, suchen wir zum Ausbau des Teams per sofort oder nach Vereinbarung einen Online Marketing Manager.


  Deine Aufgaben

    * Pflege, Optimierung und Weiterentwicklung des Internetauftrittes (DE/FR/EN)
    * Planung und Umsetzung von Aktivitäten im Bereich Suchmaschinenoptimierung (SEO), Suchmaschinenmarketing (SEM) und Social Business Media sowie stetige Weiterentwicklung dieser Themen
    * Mithilfe bei der Konzeption, Planung und Realisierung von Inbound Marketing Massnahmen
    * Content Erstellung: Texterstellung, Erstellen von Grafiken, Fotos und Videos
    * Umsetzung von Marketing Automation-Massnahmen
    * Durchführung von Analysen und Wirksamkeitsmessungen
    * Initialisierung neuer Digital-Projekte sowie deren Steuerung
    * Identifizieren von Trends und Entwicklungen im Online Marketing

  Dein Profil

    * Online-Marketing-Allrounder/in mit einem grossen technischen, logischen und analytischen Verständnis
    * Ausbildung im Bereich Kommunikation / Marketing / Wirtschaftsinformatik / Digital Marketing
    * Berufserfahrung im Digital Marketing
    * Sehr gute Kenntnisse im Bereich SEO, Content-Management und CMS
    * Erfahrung mit SEA, Performance-Kampagnen und Conversion-Optimierung von Vorteil
    * Fundierte Kenntnisse im Umgang mit Analyse-Tools (z.B. Google Trends, Ads, Search Console, etc. / Adobe Analytics)
    * Erfahrungen in den Bereichen E-Mail-Marketing/-Automation
    * Stilsicheres Deutsch und gute Englischkenntnisse in Wort und Schrift (gute Französischkenntnisse von Vorteil)

  Unser Angebot

    * Eine spannende, vielseitige Position bei welcher sie sich langfristig einbringen und etwas bewegen können
    * Eine spannende und anspruchsvolle Tätigkeit in einem führenden Industriebetrieb
    * Einen dynamisches Team
    * Ein modernerer Arbeitsplatz mit modernster Informatik
    * Moderne Anstellungsbedingungen mit sehr guten Sozialleistungen
    * Teilzeitanstellung nach Absprache und Aufteilung im Team möglich

  Dein nächster Schritt


  Bist Du interessiert? Dann freuen wir uns auf Deine Bewerbung per E-Mail.
  Solltest Du Fragen haben oder weitere Informationen wünschen, melde Dich bitte bei Sami
  auf office@one-line.ch oder Tel. +41 41 784 23 80.

  E-Mail senden
  Für diese Position laden wir ausschliesslich Kandidatinnen und Kandidaten ein, die sich direkt bei

  uns bewerben. Aus diesem Grund berücksichtigen wir keine Bewerbungen oder Anfragen
  von Personaldienstleistern. Vielen Dank für das Verständnis.


  Agentur

    * Service
    * Team
    * Partner
      `
        },
      ]
    },
    {
      id: 2,
      name: 'Run 2',
      documents: [
        {
          id: 1,
          name: 'Vacancy: Ärztin Teilzeit 40 - 60',
          content: `
          Tox Info Suisse (www.toxinfo.ch) betreibt in der Schweiz die Notrufnummer 145. Ärztinnen und Ärzte
  sowie weitere medizinische Fachpersonen geben täglich rund um die Uhr telefonisch Auskunft bei
  Vergiftungen durch Chemikalien, Medikamente, giftige Pflanzen, Pilze oder Tiere sowie Drogen und
  vieles mehr.


  An unserem Standort, mitten im Herzen von Zürich mit unseren gegen 50 Mitarbeitenden, bieten wir
  per Juni 2022 oder auch früher, einer medizinisch versierten, aufgeschlossenen Persönlichkeit eine
  interessante Stelle und ein abwechslungsreiches Aufgabengebiet als


  Ärztin/Arzt in Teilzeit 40-60%


  Zu den Aufgaben gehören im Wesentlichen:

    * Telefonische Beratung von medizinischen Fachpersonen und Laien bei Vergiftungen und
      Arzneimittelnebenwirkungen und Aufarbeitung der ärztlichen Rückmeldungen
    * Kontrolle/Verfassen von internen Beratungsdokumenten
    * Aufarbeiten von Datenmaterial
    * Aktive Teilnahme an der internen Fortbildung

  Sie erhalten zudem an dieser Stelle eine vielseitige Ausbildung in Klinischer Toxikologie und
  Vergiftungsberatung.


  Die Anforderungen an die/den zukünftigen StelleninhaberIn sind:

    * Abgeschlossenes Medizinstudium
    * Engagierte, patientenorientierte Arbeitsweise und hohes Verantwortungsbewusstsein
    * Erfahrung im klinisch-toxikologischen Umfeld von Vorteil jedoch nicht Bedingung
    * Gute Kommunikationsfähigkeiten in den Sprachen Deutsch, Französisch und Englisch in
      Wort und Schrift ist Bedingung
    * Einwandfreie Umgangsformen, Einfühlungsvermögen und Dienstleistungsmentalität

  Unser Angebot richtet sich ausdrücklich auch an Wiedereinsteigerinnen und Wiedereinsteiger, welche
  sich für eine längerfristige Tätigkeit in unserer Institution begeistern können.


  Haben wir Ihr Interesse geweckt? Dann freuen wir uns über die Einreichung Ihrer vollständigen
  Bewerbungsunterlagen (Lebenslauf, Aus- und Weiterbildungszertifikate, Arbeitszeugnisse) an
  hr@toxinfo.ch


  Auskünfte zu dieser Stellenausschreibung erteilt Ihnen gerne unsere Leitende Ärztin Dr. med. Cornelia
  Reichert unter Telefon 044 251 66 66.


  Wir freuen uns, Sie kennen zu lernen.


  Hinweis: Bewerbungen, welche uns zu dieser Stellenausschreibung auf dem Postweg zugestellt werden, können
  wir aus administrativen Gründen nicht an die Bewerber zurücksenden. Die Unterlagen werden unter Einhaltung
  des DSG durch die Empfängerin (Tox Info Suisse) nach Abschluss des Prozesses passend vernichtet.
      `
        },
        {
          id: 2,
          name: 'Vacancy: Umzugs- und Zügelaushilfen',
          content: `
  Weber-Vonesch Transport AG – Qualitätsumzüge weltweit


  Die Weber-Vonesch Transport AG in Zug ist ein etabliertes Unternehmen
  mittlerer Größe, welches im Bereich Umzüge Schweiz und weltweit seit
  Jahrzehnten erfolgreich tätig ist. Für unsere zunehmenden Aufträge brauchen
  wir Verstärkung und suchen:


  Umzugs- und Zügelaushilfen


  Sind Sie Student, Landwirt, Handwerker oder selbständig Erwerbender und
  wollen uns bei Einsätzen als Umzugsmitarbeiter gelegentlich, nach
  gegenseitiger Vereinbarung, unterstützen?


  Gute Deutschkenntnisse, gepflegte Umgangsformen, gewisses handwerkliches
  Flair und eine gute körperliche Verfassung sind die Grundvoraussetzungen.
  Von Vorteil ist ein Führerschein Kat. B. Zeitlich bringen Sie eine gewisse
  Flexibilität mit, denn unsere Aufträge sind jeden Tag unterschiedlich lang.


  Herr Michael Fürrer gibt Ihnen gerne weitere Auskünfte. Bitte senden Sie Ihre
  Bewerbungsunterlagen per Email an folgende Adresse:
  bewerbung@weber-vonesch.ch


  Weber-Vonesch Transport AG
  Personalabteilung
  Chollerstrasse 3
  6300 Zug
  Tel. 041 747 44 44
  bewerbung@weber-vonesch.ch
  www.weber-vonesch.ch


  Wir freuen uns auf Ihre Kontaktaufnahme!
      `
        }
      ]
    },
    {
      id: 3,
      name: 'Run 3',
      documents: [
        {
          id: 1,
          name: 'Vacancy: Ärztin Teilzeit 40 - 60',
          content: `
          Tox Info Suisse (www.toxinfo.ch) betreibt in der Schweiz die Notrufnummer 145. Ärztinnen und Ärzte
  sowie weitere medizinische Fachpersonen geben täglich rund um die Uhr telefonisch Auskunft bei
  Vergiftungen durch Chemikalien, Medikamente, giftige Pflanzen, Pilze oder Tiere sowie Drogen und
  vieles mehr.


  An unserem Standort, mitten im Herzen von Zürich mit unseren gegen 50 Mitarbeitenden, bieten wir
  per Juni 2022 oder auch früher, einer medizinisch versierten, aufgeschlossenen Persönlichkeit eine
  interessante Stelle und ein abwechslungsreiches Aufgabengebiet als


  Ärztin/Arzt in Teilzeit 40-60%


  Zu den Aufgaben gehören im Wesentlichen:

    * Telefonische Beratung von medizinischen Fachpersonen und Laien bei Vergiftungen und
      Arzneimittelnebenwirkungen und Aufarbeitung der ärztlichen Rückmeldungen
    * Kontrolle/Verfassen von internen Beratungsdokumenten
    * Aufarbeiten von Datenmaterial
    * Aktive Teilnahme an der internen Fortbildung

  Sie erhalten zudem an dieser Stelle eine vielseitige Ausbildung in Klinischer Toxikologie und
  Vergiftungsberatung.


  Die Anforderungen an die/den zukünftigen StelleninhaberIn sind:

    * Abgeschlossenes Medizinstudium
    * Engagierte, patientenorientierte Arbeitsweise und hohes Verantwortungsbewusstsein
    * Erfahrung im klinisch-toxikologischen Umfeld von Vorteil jedoch nicht Bedingung
    * Gute Kommunikationsfähigkeiten in den Sprachen Deutsch, Französisch und Englisch in
      Wort und Schrift ist Bedingung
    * Einwandfreie Umgangsformen, Einfühlungsvermögen und Dienstleistungsmentalität

  Unser Angebot richtet sich ausdrücklich auch an Wiedereinsteigerinnen und Wiedereinsteiger, welche
  sich für eine längerfristige Tätigkeit in unserer Institution begeistern können.


  Haben wir Ihr Interesse geweckt? Dann freuen wir uns über die Einreichung Ihrer vollständigen
  Bewerbungsunterlagen (Lebenslauf, Aus- und Weiterbildungszertifikate, Arbeitszeugnisse) an
  hr@toxinfo.ch


  Auskünfte zu dieser Stellenausschreibung erteilt Ihnen gerne unsere Leitende Ärztin Dr. med. Cornelia
  Reichert unter Telefon 044 251 66 66.


  Wir freuen uns, Sie kennen zu lernen.


  Hinweis: Bewerbungen, welche uns zu dieser Stellenausschreibung auf dem Postweg zugestellt werden, können
  wir aus administrativen Gründen nicht an die Bewerber zurücksenden. Die Unterlagen werden unter Einhaltung
  des DSG durch die Empfängerin (Tox Info Suisse) nach Abschluss des Prozesses passend vernichtet.
      `
        }
      ]
    },
  ]
}

const runs = ref(getRuns())
const selectedRun = ref(runs.value[0])

const getDocumentsByRunId = (run) => {
  return (getRuns().filter(runTmp => runTmp.id === run.id))[0].documents;
}

const currentDocuments = ref(getDocumentsByRunId(selectedRun.value))

const currentComponent = ref(DocumentList)

const runSelect = (run) => {
  selectedRun.value = run
  currentDocuments.value = getDocumentsByRunId(run)
}

</script>

