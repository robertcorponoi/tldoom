import {
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	Tldraw,
	TldrawUiMenuItem,
	TLUiOverrides,
	useIsToolSelected,
	useTools,
	BaseBoxShapeTool,
	DefaultToolbarProps,
} from "tldraw";

import { TLDoomShapeUtil } from "./TLDoomShapeUtil";

// Import the styles expected by tldraw.
import "tldraw/tldraw.css";

// Clear the console on hot reload.
if (import.meta.hot) {
	import.meta.hot.on("vite:beforeUpdate", () => console.clear());
}

export class TLDoomShapeTool extends BaseBoxShapeTool {
	/**
	 * The name of the tool.
	 */
	static override id = "doom";
	/**
	 * The initial state of the tool, which is unselected.
	 */
	static override initial = "idle";
	/**
	 * The name of the shape that the tool creates.
	 */
	override shapeType = "doom";
}

/**
 * Contains overrides for the Tldraw UI. These overrides are used to add our
 * custom tool to the toolbar and keyboard shortcuts menu.
 *
 * First, we have to add our tool to the tools object in the tools override.
 * This is where we define all the basic information about our tool - its
 * icon, label, keyboard shortcut, what happens when we select it, etc.
 *
 * Then, we replace the UI components for the toolbar and keyboard shortcut
 * dialog with our own, that add our tool to the existing default content.
 */
const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		tools.doom = {
			id: "doom",
			icon: "color",
			label: "DOOM",
			kbd: "d",
			onSelect: () => {
				editor.setCurrentTool("doom");
			},
		};

		return tools;
	},
};

/**
 * The components to override the default tldraw components with.
 */
const components: TLComponents = {
	/**
	 * Adds our custom doom tool to the beginning of the default toolbar.
	 *
	 * @param {DefaultToolbarProps} props The toolbar props.
	 *
	 * @returns {React.NamedExoticComponent<DefaultToolbarProps>} Returns the toolbar with our custom tool.
	 */
	Toolbar: (props: DefaultToolbarProps) => {
		/**
		 * The default and custom tools added to the editor.
		 */
		const tools = useTools();

		/**
		 * Indicates whether the doom custom tool is selected or not.
		 */
		const isDoomSelected = useIsToolSelected(tools["doom"]);

		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem
					{...tools["doom"]}
					isSelected={isDoomSelected}
				/>
				<DefaultToolbarContent />
			</DefaultToolbar>
		);
	},
};

/**
 * Add the doom custom shape to the list of custom shapes to add to tldraw.
 */
const customShapeUtils = [TLDoomShapeUtil];

/**
 * Add the doom custom tool to the list of custom tools to add to the tldraw
 * toolbar.
 */
const customTools = [TLDoomShapeTool];

/**
 * Used to test our custom shape.
 */
export const App = () => {
	return (
		<div style={{ position: "absolute", inset: 0 }}>
			<Tldraw
				/**
				 * Adds our custom doom shape.
				 */
				shapeUtils={customShapeUtils}
				/**
				 * Adds the button to create the doom shape.
				 */
				tools={customTools}
				overrides={uiOverrides}
				components={components}
				/**
				 * When the tldraw canvas is mounted, turn on the grid and
				 * debug mode to made it easier to debug.
				 *
				 * @param {Editor} editor The tldraw editor instance.
				 */
				onMount={(editor) => {
					editor.updateInstanceState({
						isGridMode: true,
						isDebugMode: true,
					});
				}}
			/>
		</div>
	);
};
