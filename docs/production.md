# Production notes

## Recommended setup

- run behind Nginx / Cloudflare
- use Redis cache for multi-instance deployments
- restrict /projects POST endpoint
- use read-only Google Sheets API key
- configure healthchecks
- monitor cache hit rate

## Scaling

Single instance:
- in-memory cache is enough

Multiple instances:
- use Redis
- or accept per-instance cache