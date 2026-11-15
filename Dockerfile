FROM node:22-bookworm

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN node -e "const expected = require('./package.json').devDependencies['@playwright/test']; const actual = require('@playwright/test/package.json').version; if (expected !== actual) throw new Error('Playwright version mismatch: expected ' + expected + ', found ' + actual);"
RUN npx playwright install --with-deps firefox

COPY . .

ENV CI=1

CMD ["npx", "playwright", "test", "--project=firefox", "--forbid-only"]
