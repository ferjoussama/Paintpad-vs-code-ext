# PaintPad VS Code Extension

A simple drawing tool integrated into the VS Code sidebar, allowing you to create sketches and save them directly to your workspace.

## Features

- Draw using a brush tool with customizable size and color
- Erase with a configurable eraser size
- Clear the canvas
- Save drawings as PNG files to your workspace
- Size indicator showing brush/eraser size while drawing
- Responsive canvas that adapts to the sidebar size
 
## Installation

1. Clone or download this repository
2. Run `npm install` in the project directory to install dependencies
3. Package the extension using `vsce package` (requires vsce to be installed globally: `npm install -g vsce`)
4. Install the .vsix file in VS Code through the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac) and selecting "Install from VSIX"

Alternatively, once published to the VS Code Marketplace, you can install it directly through the Extensions view by searching for "PaintPad".

## Usage

1. Open the PaintPad sidebar:
   - Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and select "PaintPad: Open"
   - Or click the PaintPad icon in the sidebar if configured
2. Use the toolbar controls:
   - **Brush**: Draw with selected color
   - **Eraser**: Erase parts of your drawing
   - **Brush Size**: Adjust drawing brush size (1-50)
   - **Eraser Size**: Adjust eraser size (1-50)
   - **Color Picker**: Choose drawing color
   - **Clear**: Reset the canvas
   - **Save**: Save drawing as PNG to your workspace
3. Draw by clicking and dragging on the canvas
4. Save your work using the Save button

## Extension Settings

This extension contributes the following commands to the Command Palette:
- `paintpad.open`: Opens the PaintPad view in the sidebar

## Requirements

- Visual Studio Code version 1.60.0 or higher
- An open workspace folder to save drawings

## Known Issues

- Saving will fail if no workspace is open
- Canvas content is not persisted between sessions

## Development

To develop this extension locally:

1. Clone the repository
2. Run `npm install`
3. Open in VS Code
4. Press `F5` to launch a development instance of VS Code with the extension loaded
5. Make changes and see them reflected in the development instance


## Contributing

Feel free to submit issues and pull requests through GitHub. Major features planned:
- Undo/redo functionality
- Additional drawing tools (line, rectangle, etc.)
- Canvas persistence between sessions

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Built using the VS Code Webview API and TypeScript.