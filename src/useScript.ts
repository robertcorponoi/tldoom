/**
 * This hook is from [useHooks](https://usehooks.com/usescript), with the
 * source on [GitHub](https://github.com/uidotdev/usehooks/blob/90fbbb4cc085e74e50c36a62a5759a40c62bb98e/index.js#L1097).
 *
 * It has been adapted to have types.
 */

import { useEffect, useState } from "react";

/**
 * The script's loaded state.
 */
export type UseScriptStatus = "idle" | "loading" | "ready" | "error";

export type UseScriptOptions = {
	/**
	 * Indicates whether the script should be prevented from being loaded or
	 * not.
	 */
	shouldPreventLoad?: boolean;
	/**
	 * Indicates whether the script should be removed when the component
	 * unmounts or not.
	 */
	removeOnUnmount?: boolean;
};

/**
 * A cache of the scripts that were added and their loaded status.
 */
const cachedScriptStatuses: Record<string, UseScriptStatus | undefined> = {};

/**
 * Returns the script node and its status.
 *
 * @param {string} src The source of the script to get.
 *
 * @returns {<{ node: HTMLScriptElement | null; status: UseScriptStatus | undefined}>}
 */
const getScriptNode = (
	src: string
): { node: HTMLScriptElement | null; status: UseScriptStatus | undefined } => {
	const node: HTMLScriptElement | null = document.querySelector(
		`script[src="${src}"]`
	);
	const status = node?.getAttribute("data-status") as
		| UseScriptStatus
		| undefined;

	return {
		node,
		status,
	};
};

/**
 * Adds a script to the document body if it hasn't been added already and
 * tracks its status.
 *
 * @param {string|null} src The source of the script.
 * @param {UseScriptOptions} options The options for the script.
 *
 * @returns {UseScriptStatus} The status of the script.
 */
export const useScript = (
	src: string | null,
	options?: UseScriptOptions
): UseScriptStatus => {
	/**
	 * The status of the script.
	 *
	 * If the script has no source or it should be prevented from being
	 * loaded, the status will be 'idle'.
	 */
	const [status, setStatus] = useState<UseScriptStatus>(() => {
		if (!src || options?.shouldPreventLoad) return "idle";
		return cachedScriptStatuses[src] ?? "loading";
	});

	useEffect(() => {
		if (!src || options?.shouldPreventLoad) return;

		// The status of the script.
		const cachedScriptStatus = cachedScriptStatuses[src];

		if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
			// If the script is already cached, set its status immediately
			setStatus(cachedScriptStatus);
			return;
		}

		// Fetch the existing script element by src because it may have been
		// added by another instance of this hook.
		const script = getScriptNode(src);
		let scriptNode = script.node;

		if (!scriptNode) {
			// Create the script element and add it to document body.
			scriptNode = document.createElement("script");
			scriptNode.src = src;
			scriptNode.async = true;
			scriptNode.defer = true;
			scriptNode.setAttribute("data-status", "loading");
			document.body.appendChild(scriptNode);

			// Store status in attribute on script.
			// This can be read by other instances of this hook.
			const setAttributeFromEvent = (event: Event) => {
				const scriptStatus: UseScriptStatus =
					event.type === "load" ? "ready" : "error";

				scriptNode?.setAttribute("data-status", scriptStatus);
			};

			scriptNode.addEventListener("load", setAttributeFromEvent);
			scriptNode.addEventListener("error", setAttributeFromEvent);
		} else {
			// Otherwise, the script is loaded so we can grab its status from
			// the attribute or we added to it or the cached status.
			setStatus(script.status ?? cachedScriptStatus ?? "loading");
		}

		/**
		 * Updates the script's status in the state.
		 *
		 * **Note:** Even if the script already exists we still need to add
		 * event handlers to update the state for *this* hook instance.
		 *
		 * @param {Event} event The `load` or `error` event.
		 */
		const setStateFromEvent = (event: Event) => {
			const newStatus = event.type === "load" ? "ready" : "error";
			setStatus(newStatus);
			cachedScriptStatuses[src] = newStatus;
		};

		// Added the script `load` and `error` events to update the state of
		// the script.
		scriptNode.addEventListener("load", setStateFromEvent);
		scriptNode.addEventListener("error", setStateFromEvent);

		// Remove the script `load` and `error` event listeners on cleanup.
		// If the script should be removed on unmount, we do that here as well.
		return () => {
			if (scriptNode) {
				scriptNode.removeEventListener("load", setStateFromEvent);
				scriptNode.removeEventListener("error", setStateFromEvent);
			}

			if (scriptNode && options?.removeOnUnmount) {
				delete cachedScriptStatuses[src];
				scriptNode.remove();
			}
		};
	}, [src, options?.shouldPreventLoad, options?.removeOnUnmount]);

	return status;
};
