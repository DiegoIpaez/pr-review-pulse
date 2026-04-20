FROM oven/bun:1 AS base
WORKDIR /app
FROM base AS builder
ENV HUSKY=0
ENV NODE_ENV=production

COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

RUN bun install --production --ignore-scripts

RUN mkdir -p storage && chown -R bun:bun /app

EXPOSE 3000
USER bun

CMD ["bun", "run", "start"]