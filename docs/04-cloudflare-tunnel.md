# cloudflare tunnel

flujo para exponer el portafolio sin abrir puertos del router.

## prerequisitos

- dominio en cloudflare (sea `tudominio.com` o un subdominio dedicado)
- cuenta de cloudflare zero trust activada (gratis hasta 50 usuarios, sobra)

## pasos

### 1. crear el tunnel

cloudflare dashboard → **zero trust** → **networks** → **tunnels** → **create tunnel**:

- tipo: **cloudflared**
- nombre: `truenas-portfolio` (o el que prefieras)
- copiar el **token** que te muestra (cadena larga `eyJ...`)

### 2. correr `cloudflared` en truenas

apps → discover → custom app → pegar:

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-portfolio
    restart: unless-stopped
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=eyJ...   # el token del paso anterior
    networks:
      - portfolio-net          # misma red que el container del sitio

networks:
  portfolio-net:
    external: true             # ya creada por el app del sitio
```

### 3. configurar el hostname público

de regreso al dashboard cf, en el tunnel recién creado → **public hostnames** → **add**:

```
subdomain:  portfolio (o www, o vacío para apex)
domain:     tudominio.com
type:       http
url:        portfolio-web:80
```

`portfolio-web` es el nombre del container del sitio (definido en el compose de [03-deploy-truenas.md](./03-deploy-truenas.md)). cloudflared lo resuelve internamente vía docker network.

### 4. verificar

- cf dashboard → tunnel debe figurar como **healthy**
- `dig portfolio.tudominio.com` debe responder con ip de cloudflare
- abrir el dominio en browser → debe llegar el sitio

## tips

- **caché agresivo**: cf dashboard → caching → configuration → browser ttl: 4 hours, edge cache ttl: respetar headers de origin (nginx ya manda los correctos)
- **page rules para inmutables**: si los assets se versionan (`asset.abc123.js`), agregar regla "cache everything" para `*.tudominio.com/assets/*`
- **acceso restringido a previews**: si querés un `staging.tudominio.com` solo para vos, cf zero trust → access → policy con email allowlist
- **redirect www → apex (o viceversa)**: en cf bulk redirects, no en código
- **video range requests por cf**: cloudflare respeta `Accept-Ranges` y hace cache de chunks, no del archivo entero, así que el scrub funciona bien
