# Configuração de URLs - Festa Julina UCDB

## Estrutura de URLs

### Produção
- **Base URL**: `https://app-pais.ucdb.br/festa-julina`
- **Frontend**: `https://app-pais.ucdb.br/festa-julina/`
- **API Backend**: `https://app-pais.ucdb.br/festa-julina/api/v1/`

### Mapeamento Nginx

```nginx
# Frontend (Next.js) - Porta 3000
location / {
    proxy_pass http://172.17.0.1:3000;
}

# Backend API (NestJS) - Porta 3001
location /api/v1/ {
    proxy_pass http://172.17.0.1:3001;
}
```

### Health Checks

#### Backend
- **URL**: `/health`
- **Proxy**: `http://172.17.0.1:3001`
- **Exemplo**: `https://app-pais.ucdb.br/festa-julina/health`

#### Frontend
- **URL**: `/api/health`
- **Proxy**: `http://172.17.0.1:3000`
- **Exemplo**: `https://app-pais.ucdb.br/festa-julina/api/health`

### Variáveis de Ambiente

#### NEXTAUTH_URL
```env
NEXTAUTH_URL=https://app-pais.ucdb.br/festa-julina
```

#### NEXT_PUBLIC_URL_BASE
```env
NEXT_PUBLIC_URL_BASE=https://app-pais.ucdb.br/festa-julina/api/v1
```

### Configurações SSL

```nginx
ssl_certificate /cert/certificate.crt;
ssl_certificate_key /cert/private.key;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

### CORS

O nginx está configurado para permitir CORS para o domínio:
```nginx
add_header Access-Control-Allow-Origin "https://app-pais.ucdb.br" always;
```

### Cache e Performance

#### Static Files
- Cache: 1 ano para arquivos estáticos (js, css, imagens)
- Headers: `Cache-Control: "public, immutable"`

#### PWA Files
- Service Workers: No cache
- Headers: `Cache-Control: "no-cache, no-store, must-revalidate"`

#### Buffers
- `proxy_buffer_size: 128k`
- `proxy_buffers: 4 256k`
- `proxy_busy_buffers_size: 256k`

### Rate Limiting

#### Web Traffic
- Zone: `web`
- Rate: 50 requests/second
- Burst: 20

#### API Traffic
- Zone: `api`
- Rate: 10 requests/second
- Burst: 50

### Upload Limits

#### API Endpoints
- `client_max_body_size: 250M`

### Timeouts

- `proxy_connect_timeout: 60s`
- `proxy_send_timeout: 60s`
- `proxy_read_timeout: 60s`

## Troubleshooting

### Verificar Configuração
```bash
# Testar sintaxe do nginx
nginx -t

# Recarregar configuração
nginx -s reload
```

### Debug de Proxy
```bash
# Logs do nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Testar conectividade
curl -I https://app-pais.ucdb.br/festa-julina/
curl -I https://app-pais.ucdb.br/festa-julina/api/v1/
```

### Health Checks
```bash
# Backend
curl https://app-pais.ucdb.br/festa-julina/health

# Frontend
curl https://app-pais.ucdb.br/festa-julina/api/health
```
