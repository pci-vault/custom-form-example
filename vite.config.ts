import { resolve} from 'path';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/entry.js'),
      name: "CustomForm",
      // the proper extensions will be added
      fileName: "custom-form",
    },
    rollupOptions: {
      output: {
        dir: "./dist/custom-form",
        entryFileNames: "custom-form.js",
      },
    },
  },
  base: "./",
});
