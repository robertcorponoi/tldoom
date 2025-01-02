/**
 * Declares new types or augments existing types that go in the global
 * namespace.
 */
declare global {
	interface Window {
		/**
		 * The `Module` object is used by emscripten as configuration options.
		 */
		Module: {
			/**
			 * The function that should run before running the game.
			 */
			preRun: (() => void)[];
			/**
			 * The canvas element to use for the game.
			 */
			canvas: HTMLElement | null;
		};
		/**
		 * The `Browser` object is declared by emscripten.
		 */
		Browser: {
			/**
			 * Sets the size of the canvas that the game is displayed on.
			 */
			setCanvasSize: (w: number, h: number) => void;
		};
		/**
		 * Options to pass to SDL.
		 */
		SDL: {
			defaults: {
				copyOnLock: boolean;
			};
		};
	}
}

export {};
