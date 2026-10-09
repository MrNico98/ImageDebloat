# ImageDebloat

Repository di soli dati: associa nomi di app Windows a immagini e identità Appx a etichette localizzate. Non contiene un programma di rimozione e non esegue modifiche al sistema.

## File

- `ImmaginiDebloat.json`: voci visuali con `Nome`, `ID` e URL dell'immagine.
- `AssociazioniDebloat.json`: identità di pacchetti Appx associate alle etichette usate dal consumer.
- `Immagini/`: asset PNG referenziati dalla prima mappa.

Le associazioni possono includere pacchetti senza una voce visuale dedicata: non sono forzate a corrispondere a un asset.

## Validazione

Richiede Node.js 26, senza dipendenze esterne:

```sh
node --check scripts/validate-data.mjs
node scripts/validate-data.mjs
```

La CI verifica schema, unicità degli ID, dominio/percorso HTTPS e presenza degli asset locali. GitHub Actions è monitorato da Dependabot.

## Sicurezza e provenienza

Gli URL puntano attualmente agli asset del repository upstream `MrNico98/ImageDebloat`; i consumer li scaricano direttamente. Non trattare la sola presenza di HTTPS come verifica crittografica dei file: prima di distribuire asset in un installer, fissare una revisione immutabile e verificare hash attesi.
