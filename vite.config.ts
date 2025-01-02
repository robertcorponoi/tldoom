import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

/**
 * The configuration options for vite.
 *
 * https://vite.dev/config/
 */
export default defineConfig({
	build: {
		lib: {
			/**
			 * The entry point for the library.
			 */
			entry: resolve(__dirname, "lib/index.ts"),
			/**
			 * The name of the library.
			 */
			name: "TLDoom",
			/**
			 * The name of the file to output.
			 */
			fileName: "tldoom",
		},
		rollupOptions: {
			/**
			 * Dependencies that shouldn't be bundled with the library.
			 */
			external: ["react", "react-dom", "tldraw"],
		},
	},
	/**
	 * Vite can be extended with plugins, which are based on Rollup's plugins
	 * with a few extra Vite-specific options.
	 */
	plugins: [
		/**
		 * Compiles React with SWC.
		 *
		 * https://github.com/vitejs/vite-plugin-react-swc
		 */
		react(),
	],
});
