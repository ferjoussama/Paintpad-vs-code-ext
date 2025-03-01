# PaintPad - VS Code Extension

Welcome to **PaintPad**, a simple drawing pad integrated into Visual Studio Code! This extension adds a sidebar canvas where you can sketch, doodle, or visualize ideas without leaving your coding environment. Features include a brush, eraser, adjustable sizes, a color picker, and the ability to save your drawings as PNG files in your workspace.

## Features

- **Sidebar Canvas**: Draw directly in a dedicated VS Code sidebar view.
- **Brush Tool**: Draw with customizable brush sizes (1–50 pixels).
- **Eraser Tool**: Erase with adjustable sizes (1–50 pixels).
- **Color Picker**: Select any color for your brush.
- **Clear Canvas**: Start fresh with a single click.
- **Save Drawings**: Export your sketches as PNG files to your workspace folder.
- **Size Indicator**: Preview your brush or eraser size while drawing.

## Demo

![PaintPad Demo](https://raw.githubusercontent.com/ferjoussama/Paintpad-vs-code-ext/main/media/demo.gif)

## Requirements

- Visual Studio Code version 1.60.0 or higher.
- A workspace folder must be open to save drawings.

## Installation

1. **Install via VS Code Marketplace** (once published):
   - Search for "PaintPad" in the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
   - Click **Install**.

2. **Manual Installation** (for development):
   - Clone the repository: `git clone https://github.com/ferjoussama/Paintpad-vs-code-ext`.
   - Navigate to the project folder: `cd Paintpad-vs-code-ext`.
   - Install dependencies: `npm install`.
   - Open the folder in VS Code and press `F5` to launch the extension in a development instance.

## Usage

1. **Open PaintPad**:
   - Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   - Type `Open PaintPad` and press Enter.
   - Alternatively, click the PaintPad icon in the Activity Bar to access the sidebar.

2. **Drawing**:
   - Use the **Brush** or **Eraser** buttons to select your tool.
   - Adjust the size with the sliders (Brush Size or Eraser Size).
   - Choose a color with the **Color Picker**.
   - Click and drag on the canvas to draw or erase.

3. **Clearing the Canvas**:
   - Click the **Clear** button to reset the canvas.

4. **Saving Your Work**:
   - Click the **Save** button.
   - Enter a file name (e.g., `mys sketch.png`) in the input box.
   - The drawing will be saved as a PNG in your workspace root folder.

## Extension Commands

- **`paintpad.open`**: Opens the PaintPad sidebar view.

## Known Issues

- Saving fails if no workspace folder is open. Ensure a workspace is loaded.
- Canvas content may reset when resizing the window due to dynamic resizing.

## Contributing

Contributions are welcome! Please:
1. Fork the repository on [GitHub](https://github.com/ferjoussama/Paintpad-vs-code-ext).
2. Create a feature branch.
3. Submit a pull request with your changes.

Report bugs or suggest features via [GitHub Issues](https://github.com/ferjoussama/Paintpad-vs-code-ext/issues).

## License

This extension is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Thanks to the open-source community for tools like Webpack and TypeScript.