import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    // Change me if you have the app in other place
    MUSCLE_MATE_URL: "http://localhost:5173",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
