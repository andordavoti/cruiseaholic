# Cruiseaholic

## Frontend:

- React, TypeScript, Redux Toolkit, Material UI

## Admin credentials

- **Username:** Admin
- **Password:** Admin123

## Logging

Gjort med NLog.

Log filene ligger i mappen logs i prosjekt root mappen. Endringer gjort til databasen er logget til "cruiseaholic-db-changes.log", resten er logget til "cruiseaholic-logs.log".

Hadde det vært flere brukere, så hadde vi implementert logging av brukernavn som utfører operasjonene. Men siden det kun er en admin bruker så er ikke dette nødvendig.

## Code coverage

For å sjekke code coverage så er [VSMac-CodeCoverage](https://github.com/ademanuele/VSMac-CodeCoverage) brukt. Alle klasser bortsettfra "OrderController" er ekskludert fra coverage.

Resultater:

- Line: 100%
- Branch: 100%
