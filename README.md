# AQA-playwright
playwright homeworks

## Run the Firefox tests in Docker

The image uses Node.js 22 on Debian Bookworm, installs the exact Playwright version
locked by `package-lock.json`, and installs Firefox with its system dependencies.
Environment files are excluded from the image; pass the selected local environment
file at runtime:

```sh
docker build -t aqa-playwright-firefox .
docker run --rm --env-file .env.qauto -e TEST_ENV=qauto aqa-playwright-firefox
```

To run against `qauto2`, use `--env-file .env.qauto2 -e TEST_ENV=qauto2`.
The container sets `CI=1` and runs the Firefox project with `--forbid-only`.

To capture a screenshot showing the pinned Playwright version, Firefox run
parameters, and passing test summary in one terminal session, run:

```sh
docker run --rm --env-file .env.qauto -e TEST_ENV=qauto \
  --entrypoint sh aqa-playwright-firefox \
  -c 'npx playwright --version && npx playwright test --project=firefox --forbid-only'
```

After the run finishes successfully, capture the terminal showing that command,
the Playwright version, and the final passed-test summary.
