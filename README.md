# Motor Seller · Dashboard v1

Dashboard de actividad de agencias en **Motor Seller** — Seminuevos (MX) y Patiotuerca (EC).

## V1 — alcance

| Ruta | Uso |
|------|-----|
| `/` **Resumen** | Vista por defecto · KPIs rápidos |
| `/modules` | Explorar adopción por módulo + export CSV |
| `/dealers` | Listado de agencias + export CSV |

### Incluye
- Filtros: país, panel vs CRM, web/móvil, periodo (7/30/90)
- Definiciones fijas: adopción, lead, sesión, CRM only
- App móvil como **filtro de plataforma**, no como módulo del catálogo

### Catálogo de módulos
Tablero · Prospectos · Perfilador express · Contactos · Leads · Vehículos · Estadísticas · Usuarios · Facturación · Configuración

## Cómo correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).
