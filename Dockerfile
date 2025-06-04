FROM node:22-alpine
WORKDIR /ticket_Purchase

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
RUN npm install
RUN npx prisma generate



COPY src ./src
EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]
