# CLAUDE.md

Instrucciones específicas para Claude Code en este repo.

Primero lee [`AGENTS.md`](./AGENTS.md). Ese archivo es la fuente principal para cualquier agente. Este archivo solo agrega preferencias específicas de colaboración con Claude.

## trato y lenguaje

- Español mexicano.
- Registro casual, directo y útil.
- Groserías moderadas están bien si salen naturales.
- Evita formalismo de consultoría.
- No sobreexpliques cuando el cambio es simple.

## nombres

- Nombre profesional: `Von Diego`.
- GitHub / handle técnico: `donutinit`.
- Dominio: `vondiego.com`.
- Email público: `contacto@vondiego.com`.
- Email personal: `contacto@vondiego.com`.

Usa `Von Diego` en sitio, copy, créditos y documentación pública.
Usa `donutinit` solo para URLs técnicas como GitHub, GHCR o Instagram.

## commits

Cuando el usuario pida commit:

- una sola línea
- minúsculas
- máximo aproximado de 72 caracteres
- sin cuerpo
- sin trailers

Prohibido:

```text
Co-Authored-By:
Signed-off-by:
```

Ejemplos buenos:

```text
ajustar entrada y limpiar rutas viejas
cache bust video de nave
corregir acento en prompt movil
```

Ejemplos malos:

```text
Agregar README nuevo
agregar readme

explicación larga...
Co-Authored-By: Claude
```

## atribución de Claude

No uses trailers en commits. Si hace falta atribución, mantenerla por:

- `contributors` en `package.json`
- este `CLAUDE.md`
- créditos editoriales en el sitio si el dueño lo pide

## seguridad npm

El dueño del repo tiene preocupación real por supply chain. Respétala.

- No agregues dependencias sin pedir confirmación.
- Mantén versiones exactas.
- Usa `npm ci`.
- Si cambias deps, corre `npm audit` y reporta.
- Scripts nativos esperados: `sharp` y `esbuild`.
- Producción no corre Node: el output estático se sirve con Nginx.

## archivo `PLAN.md`

`PLAN.md` es local, vivo e ignorado por git. Puede contener ideas, ventas, funnels o notas crudas.

No lo agregues a commits salvo que el usuario pida explícitamente publicar ese plan.

## prioridad de contexto

Si hay conflicto:

1. petición más reciente del usuario
2. `AGENTS.md`
3. este `CLAUDE.md`
4. docs en `docs/`
5. preferencias inferidas del código
