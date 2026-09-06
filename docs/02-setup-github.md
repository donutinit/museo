# setup github

## qué se hizo

- [x] cuenta de github existente (`donutinit`)
- [x] ssh key generada y agregada (`~/.ssh/id_ed25519_github.pub`)
- [x] repo creado: `github.com/donutinit/museo` (público)
- [x] git config local (`Von Diego` / `contacto@vondiego.com`)
- [x] primer clone vía ssh (`git@github.com:donutinit/museo.git`)
- [x] primer commit con estructura base

## qué falta del lado github

- [ ] **workflow de github actions** (`.github/workflows/build.yml`) — se agrega cuando metamos el proyecto astro
- [ ] **permisos del workflow** para escribir packages → en el yaml del workflow:
  ```yaml
  permissions:
    contents: read
    packages: write
  ```
- [ ] **tras primer push de imagen**: cambiar visibility del package a `public` en
  `github.com/users/donutinit/packages/container/museo/settings`
- [ ] **(opcional)** branch protection en `main` para que requiera pr → settings → branches → add rule

## sobre el ssh

Von Diego tiene dos llaves:

- `~/.ssh/id_ed25519` — llave de uso general
- `~/.ssh/id_ed25519_github` — llave dedicada a github

`~/.ssh/config` ya tiene el routing configurado (o lo asume git por defecto). la llave dedicada a github es la registrada en `github.com/settings/keys`.

## sobre tokens

- el `GITHUB_TOKEN` que usa gha viene **automático** en cada run, no hay que crear pat manual
- alcance del token automático: solo el repo donde corre el workflow + permisos que declaremos en el yaml
- si en el futuro queremos imagen **privada**, ver `03-deploy-truenas.md` para cómo configurar un pat (`read:packages`) en el nas

## notas

- repo público con licencia [hlqsthuhalv](../LICENSE) — total libertad de uso
- la organización del repo es estándar github, nada raro
