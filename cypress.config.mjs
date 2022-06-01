import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  screenshotOnRunFailure: false,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {},
    supportFile: false,
  },
})
