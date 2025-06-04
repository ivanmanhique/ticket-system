#!/bin/sh
set -e

echo "Running migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting server..."
exec "$@"
