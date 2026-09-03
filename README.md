# academia-industry-portal
Skill mapping, internship, and placement collaboration portal

# Academia–Industry Collaboration Portal

A full-stack MVP that helps students discover skill gaps, build a verified-ready profile, and find internships or entry-level opportunities aligned with their skills. Industry users can publish roles with required skills.

## Run locally

```powershell
node server.js
```

Open `http://localhost:3000`. No package installation or database service is required.

## Included workflows

- Student skill assessment across technical, soft, and AYUSH-domain skills
- Readiness score, strengths, skill gaps, and tailored learning recommendations
- Transparent opportunity matching with matched and missing skills
- Industry opportunity publishing form
- Career ecosystem dashboard with opportunity dataset and skill taxonomy

## Data model

`data/portal-data.json` is created automatically on first run and stores student profiles, submitted assessments, and posted opportunities. The CSV files are portable seed datasets suitable for import into a later PostgreSQL/MongoDB deployment.

## Production next steps

Add authenticated accounts (student, industry, academician, administrator), document verification, file storage, consent controls, PostgreSQL, audit logs, multilingual support, and an ML-based matcher after enough verified placement data is collected.