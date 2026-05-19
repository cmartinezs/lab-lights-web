# Luces del Laboratorio — Especificación Transversal

**Versión:** 1.5  
**Fecha:** Mayo 2026  
**Responsabilidad:** Compartida / arquitectura / calidad  
**Repos destino:** `lab-lights-web` y `lab-lights-api`

---

## Propósito

Este documento contiene decisiones y estándares que afectan a ambos repositorios: stack, arquitectura, coordinación entre repos, contratos, calidad, testing, resiliencia, observabilidad, CI/CD y Definition of Done. No debe contener detalles exclusivos de implementación visual ni reglas privadas del backend salvo cuando sean contratos compartidos.

---

## Directrices técnicas de desarrollo

## Stack recomendado

La implementación recomendada es:

| Capa | Tecnología | Decisión |
|---|---|---|
| Frontend | React + TypeScript + Vite | Recomendado para el juego principal |
| Estilos frontend | Tailwind CSS | Sistema base para layout, tokens, responsive, estados y composición visual |
| Animación frontend | Anime.js | Animaciones declarativas y secuencias puntuales de UI/juego |
| Framework alternativo | Next.js | Solo si se requieren SSR, SEO avanzado, rutas públicas de marketing o portal web separado |
| Backend | Go | API, validación de partidas, economía, rankings y sincronización |
| Base de datos | Supabase PostgreSQL | Persistencia transaccional, auth, realtime y almacenamiento |
| Arquitectura de datos | CQRS | Separación entre escrituras validadas y lecturas optimizadas |
| Testing frontend | Vitest + Testing Library + Playwright | Unitarios, componentes y e2e |
| Testing backend | `go test`, mocks/fakes, pruebas de integración | Dominio, casos de uso, repositorios y API |
| BDD | Gherkin | Criterios de aceptación para reglas de juego y flujos críticos |
| Calidad estática | SonarQube + linters | Revisión de bugs, deuda técnica, cobertura y duplicación |

**Decisión Vite vs Next.js:** para el juego, Vite es la mejor opción inicial porque entrega arranque rápido, bundle simple, control directo del rendering interactivo y menor complejidad operacional. Next.js debe considerarse si el producto agrega páginas indexables, blog, landing comercial, panel administrativo con SSR o autenticación/routing complejo del lado servidor. Si se usa Next.js, el juego debe seguir encapsulado como cliente interactivo (`client component`) y el dominio no debe depender del framework.

## Principios de arquitectura

El proyecto debe aplicar:
- **Arquitectura Hexagonal:** el dominio no depende de frameworks, base de datos, HTTP, Supabase ni React.
- **DDD:** las reglas centrales viven en el dominio del juego: tablero, movimientos, partida, puntuación, economía, rankings, logros y validación.
- **SOLID:** componentes, servicios y casos de uso con responsabilidades claras, dependencias invertidas y contratos pequeños.
- **KISS:** preferir soluciones simples, legibles y directas; evitar abstracciones prematuras.
- **DRY:** eliminar duplicación real de reglas de negocio, no forzar abstracciones por coincidencias superficiales.
- **Clean Code:** nombres precisos, funciones pequeñas, errores explícitos, efectos secundarios aislados y código testeable.

## Organización multi-repositorio

El frontend y el backend deben vivir en repositorios separados:

| Repositorio | Responsabilidad |
|---|---|
| `lab-lights-web` | Web app React + Vite, experiencia de juego, estado local, offline-first, consumo de API |
| `lab-lights-api` | Backend Go, dominio autoritativo, validación, economía, rankings, Supabase, migraciones |

No se recomienda un monorepo para esta versión. La separación permite ciclos de despliegue independientes, ownership claro, pipelines específicos por tecnología y menor acoplamiento operacional.

Repositorio frontend sugerido:

```
lab-lights-web/
  src/
    app/                # Bootstrap, rutas, providers
    game/
      domain/           # Reglas puras necesarias para UX local
      application/      # Use cases cliente: startGame, applyMove, usePowerUp
      ui/               # Componentes React
      infra/            # API client, storage local, IndexedDB
    profile/
    rankings/
    shared/
  docs/
    adr/
    gherkin/
  tests/
    e2e/
```

Las features deben organizarse por capas internas cuando tengan dominio o flujos propios:
- `domain`: reglas puras, entidades, value objects y lógica determinista.
- `application`: casos de uso, coordinación de estado y orquestación sin detalles de framework.
- `ui`: pantallas, secciones, componentes React, hooks de UI y composición visual.
- `infra`: clientes HTTP, storage local, adaptadores externos y mapeos de DTO.

La UI frontend debe usar una jerarquía consistente de componentes: `Layout`, `Page`, `Section`, `Component`, `MicroComponent`, `NanoComponent`. Esta jerarquía define responsabilidad y composición, no necesariamente nombres obligatorios de archivo para todos los casos.

Repositorio backend sugerido:

```
lab-lights-api/
  cmd/
    api/
  internal/
    game/
      domain/
      application/
      ports/
      adapters/
    economy/
    rankings/
    profile/
    platform/
      http/
      postgres/
      supabase/
      config/
  api/
    openapi/
  infra/
    supabase/
      migrations/
      seed/
      policies/
  docs/
    adr/
    gherkin/
```

El backend es la fuente de verdad para las reglas competitivas. El frontend puede duplicar reglas puras para dar feedback inmediato, pero toda partida ranked debe validarse en Go. Si el dominio existe en Go y TypeScript, debe existir una suite de pruebas de paridad para asegurar que seed, movimientos, puntaje y validación produzcan el mismo resultado en ambos repositorios.

## Coordinación entre repositorios

- El contrato OpenAPI vive en `lab-lights-api` y se publica como artefacto versionado.
- `lab-lights-web` consume tipos/clientes generados desde una versión explícita del contrato.
- Todo cambio breaking de API requiere nueva versión (`/v2`) o ventana de compatibilidad.
- Los cambios no breaking deben ser backward-compatible hasta que el frontend desplegado en producción los consuma.
- Cada repositorio tiene su propio CI, pero debe existir un pipeline de compatibilidad que ejecute smoke/e2e contra ambos artefactos.
- Las decisiones compartidas se documentan como ADR en el repositorio afectado; si impactan ambos, se copian o enlazan en ambos repos.
- Los escenarios Gherkin críticos deben mantenerse sincronizados entre repositorios cuando cubren comportamiento end-to-end.

---

## Testing unitario

Reglas:
- Las reglas de dominio deben tener unit tests rápidos, deterministas y sin IO.
- Cobertura mínima recomendada: **80% global** y **90% en dominio crítico**.
- Casos obligatorios: inversión de salas, adyacencias, seeds, victoria/derrota, puntuación, monedas, continuaciones, reordenamiento, logros y validación anti-cheat.
- Los tests no deben depender del orden del reloj real ni de aleatoriedad no controlada.

Herramientas:
- Frontend: Vitest, Testing Library.
- Backend: `go test ./...`, `testify` opcional, fakes manuales para puertos.

## Gherkin / BDD

Los criterios de aceptación de reglas importantes deben escribirse en Gherkin:

```gherkin
Feature: Continuar una partida perdida
  Scenario: Continuar una partida de Time Attack con monedas
    Given una partida Time Attack agotó su tiempo
    And el jugador tiene 50 monedas
    When el jugador compra "Tiempo extra corto"
    Then la partida recibe 30 segundos adicionales
    And el puntaje final tendrá una penalización de 40%
    And la partida no será elegible para ranking online competitivo
```

Los `.feature` deben vivir en `docs/gherkin/` y conectarse a pruebas automatizadas donde sea razonable. Si un escenario no se automatiza, debe quedar marcado como criterio manual de aceptación.

## Tests de integración

Backend:
- Probar repositorios contra PostgreSQL/Supabase local o contenedor.
- Verificar migraciones, constraints, RLS, idempotencia y transacciones.
- Validar que comandos duplicados no cobren monedas ni reclamen recompensas dos veces.

Frontend:
- Probar hooks y servicios con API mockeada.
- Probar persistencia offline con IndexedDB fake o entorno equivalente.

## Tests e2e

Usar Playwright para cubrir flujos reales:
- Iniciar partida Classic y ganar.
- Perder Time Attack y continuar con monedas.
- Usar reordenamiento en tablero visible.
- Reclamar recompensa local.
- Login, envío de puntaje y visualización de ranking online.
- Modo offline y sincronización posterior.

Los tests e2e deben ejecutarse en CI contra un entorno aislado con datos semilla. Deben evitar depender de rankings compartidos o datos productivos.

## Revisión estática y calidad

Cada repositorio debe configurar hooks de pre-commit para ejecutar validaciones rápidas antes de confirmar cambios. Como mínimo:
- Formato automático o verificación de formato.
- Lint rápido sobre archivos modificados cuando sea viable.
- Typecheck o pruebas unitarias selectivas si el tiempo de ejecución se mantiene bajo.
- Validación de mensajes o metadatos de commit si el equipo adopta una convención.

Los hooks de pre-commit no reemplazan CI: deben optimizar feedback local y reducir errores triviales, mientras que CI mantiene la verificación autoritativa completa.

CI mínimo por repositorio:

Frontend (`lab-lights-web`):
- hooks de pre-commit configurados y documentados
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- Playwright e2e contra backend de staging o mock contractual antes de release
- análisis SonarQube

Backend (`lab-lights-api`):
- hooks de pre-commit configurados y documentados
- `go test ./...`
- `go vet ./...`
- `gofmt` / `goimports`
- migraciones Supabase contra entorno local/staging
- análisis SonarQube

Compatibilidad entre repositorios:
- validar OpenAPI publicado por `lab-lights-api`
- regenerar cliente/tipos en `lab-lights-web`
- ejecutar smoke tests contra ambos artefactos
- ejecutar Playwright e2e en staging antes de promover a producción

SonarQube debe revisar:
- Bugs y vulnerabilidades.
- Code smells.
- Duplicación.
- Cobertura.
- Complejidad ciclomática.
- Código no testeado en dominio crítico.

Quality gate recomendado:
- Sin bugs críticos/blocker.
- Sin vulnerabilidades críticas/blocker.
- Cobertura nueva >= 80%.
- Duplicación nueva < 3%.
- Complejidad revisada en funciones de dominio.

---

## Resiliencia transversal

- El sistema debe degradar funcionalidad sin perder progreso local ni comprometer integridad competitiva.
- El cliente puede cachear y operar offline para experiencia, pero el backend mantiene la autoridad sobre economía, rankings y validación.
- Realtime es una mejora de experiencia, no una dependencia crítica.
- Si realtime falla, la UI debe caer a polling moderado o actualización manual.
- Los eventos duplicados deben ser seguros de procesar.
- La sincronización offline debe ser ordenada por perfil/partida y tolerante a duplicados.
- La API debe diferenciar `409` por conflicto/idempotencia, `422` por regla de negocio, `429` por rate limit y `503` por dependencia no disponible.
- Las respuestas y logs deben incluir `request_id`/`correlation_id`.


---

## Seguridad y privacidad

- Nunca confiar en puntajes calculados solo por el cliente.
- Validar JWT de Supabase en backend Go.
- Usar RLS en Supabase para lecturas/escrituras directas permitidas.
- No almacenar contraseñas fuera del proveedor de autenticación.
- Registrar auditoría para monedas, power-ups, recompensas y rankings.
- Rate limiting para envío de partidas, login y endpoints de ranking.
- Sanitizar nombres de usuario e iniciales visibles.

## Observabilidad

- Logs estructurados en backend.
- Métricas de latencia, errores, comandos rechazados, validaciones fallidas y economía.
- Métricas de cache hit/miss, retries, circuit breakers abiertos, comandos idempotentes duplicados y sincronización offline.
- Trazas para comandos críticos.
- Eventos analíticos no invasivos: inicio/fin de partida, derrota, uso de ayuda, abandono, recompensa reclamada.
- No registrar información sensible ni secuencias completas de partida en analytics de terceros sin consentimiento.

## CI/CD y ambientes

Ambientes mínimos:
- `local`: Supabase local, API Go local, Vite dev server.
- `staging`: datos aislados, usado para QA y e2e.
- `production`: datos reales, migraciones controladas.

## Versionado semántico y GitFlow

Los repositorios deben usar **versionado semántico (SemVer)** con formato `MAJOR.MINOR.PATCH`:
- `MAJOR`: cambios incompatibles de API, contratos, persistencia o comportamiento público.
- `MINOR`: nuevas funcionalidades backward-compatible.
- `PATCH`: correcciones, ajustes internos y cambios sin impacto funcional incompatible.

Las APIs públicas, contratos OpenAPI, migraciones y clientes generados deben estar asociados a una versión explícita. Todo cambio breaking requiere nueva versión de API (`/v2`) o una ventana de compatibilidad documentada.

El flujo de ramas recomendado es **GitFlow**:
- `master`: estado productivo, protegido y etiquetado con releases SemVer.
- `develop`: integración continua de features listas para QA.
- `feature/<nombre>`: trabajo incremental desde `develop`.
- `release/<version>`: estabilización, QA, changelog y ajustes finales antes de producción.
- `hotfix/<version>`: correcciones urgentes desde `master`, mergeadas de vuelta a `master` y `develop`.

Cada release debe generar tag Git (`vX.Y.Z`) y changelog. Las ramas protegidas deben requerir PR, CI exitoso, revisión y validación de contratos cuando aplique.

Prácticas:
- Migraciones revisadas por PR.
- Seeds separados para desarrollo/test.
- Variables de entorno documentadas.
- Releases con changelog.
- Rollback definido para backend y migraciones.

## Definition of Done técnica

Una feature se considera terminada cuando:
- Tiene criterios de aceptación claros.
- Implementa dominio, UI, API y persistencia si corresponde.
- Incluye unit tests relevantes.
- Incluye Gherkin para flujos de negocio críticos.
- Mantiene o mejora cobertura.
- Define comportamiento de cache, expiración, invalidación y resiliencia si toca datos remotos o sincronización.
- Pasa lint, typecheck, `go test`, revisión estática y e2e aplicables.
- No introduce deuda técnica sin registrar decisión o tarea.
- Documenta cambios de contrato, migración o comportamiento visible.

---
