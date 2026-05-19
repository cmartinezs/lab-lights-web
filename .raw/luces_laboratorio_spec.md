# Luces del Laboratorio — Índice de Especificaciones

**Versión:** 1.5  
**Fecha:** Mayo 2026  
**Estado:** Draft  
**Documento original dividido por responsabilidad:** Sí

---

## Objetivo

La especificación fue dividida en documentos por naturaleza para poder distribuirlos entre repositorios sin mezclar responsabilidades que no competen. El frontend y el backend tienen documentos propios, y las decisiones compartidas viven en documentos transversales.

## Documentos

| Documento | Naturaleza | Repo destino | Uso |
|---|---|---|---|
| [PRE_ROADMAP.md](PRE_ROADMAP.md) | Planificación preliminar | `lab-lights-web`, `lab-lights-api` | Visualiza lanzamientos funcionales incrementales desde MVP hasta Endgame |
| [01_producto_reglas_juego.md](specs/01_producto_reglas_juego.md) | Producto / reglas de juego | `lab-lights-web`, `lab-lights-api` | Fuente compartida para reglas visibles, modos, puntuación, economía, progresión y balance |
| [02_frontend_web.md](specs/02_frontend_web.md) | Frontend | `lab-lights-web` | UI, flujo de pantallas, React/Vite, estado local, cache cliente, offline y tests frontend |
| [03_backend_api.md](specs/03_backend_api.md) | Backend | `lab-lights-api` | Go API, Supabase, CQRS, persistencia, rankings, economía, validación y tests backend |
| [04_transversal_arquitectura_calidad.md](specs/04_transversal_arquitectura_calidad.md) | Transversal | `lab-lights-web`, `lab-lights-api` | Arquitectura, coordinación multi-repo, contratos, calidad, resiliencia, observabilidad y CI/CD |
| [05_glosario.md](specs/05_glosario.md) | Glosario | `lab-lights-web`, `lab-lights-api` | Lenguaje común entre producto, frontend y backend |

## Reglas de Distribución

- `lab-lights-web` debe recibir: producto/reglas, frontend, transversal y glosario.
- `lab-lights-api` debe recibir: producto/reglas, backend, transversal y glosario.
- El backend es fuente de verdad para validación competitiva, economía, rankings online y persistencia transaccional.
- El frontend es dueño de experiencia, accesibilidad, estado local, offline UX y presentación.
- Los contratos OpenAPI viven en `lab-lights-api` y se consumen desde `lab-lights-web` mediante tipos/clientes generados.
- Las reglas compartidas deben cambiarse primero en producto/reglas y luego reflejarse en cada implementación.

## Versionado

- Esta división corresponde a la versión `1.5`.
- Los documentos deben versionarse juntos cuando cambia una regla compartida.
- Cambios exclusivos de frontend o backend pueden actualizar solo el documento correspondiente, siempre que no alteren contratos ni reglas compartidas.
- Los productos, APIs y artefactos publicados deben usar versionado semántico (`MAJOR.MINOR.PATCH`).
- Los repositorios deben trabajar con GitFlow: `master`, `develop`, `feature/*`, `release/*` y `hotfix/*`.

---

*Fin del índice — v1.5*
