#!/usr/bin/env sh
/usr/local/bin/node /usr/local/bin/npm run --prefix /app migration:run
/usr/local/bin/node /usr/local/bin/npm run --prefix /app seed:run
exec "$@"