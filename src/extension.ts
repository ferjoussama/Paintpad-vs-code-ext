import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const provider = new PaintPadViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(PaintPadViewProvider.viewType, provider)
  );

  let openDisposable = vscode.commands.registerCommand('paintpad.open', () => {
    vscode.commands.executeCommand('workbench.view.extension.paintpad-sidebar');
  });

  context.subscriptions.push(openDisposable);
}

class PaintPadViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'paintpad-canvas';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
  ) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async data => {
      switch (data.type) {
        case 'save':
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
          }
          const folderPath = workspaceFolders[0].uri.fsPath;
          const fileName = await vscode.window.showInputBox({
            prompt: 'Enter file name',
            placeHolder: 'sketch.png'
          });
          if (fileName) {
            const filePath = path.join(folderPath, fileName);
            fs.writeFile(filePath, Buffer.from(data.imageData.split(',')[1], 'base64'), (err) => {
              if (err) {
                vscode.window.showErrorMessage('Failed to save the image');
              } else {
                vscode.window.showInformationMessage(`Saved to ${filePath}`);
              }
            });
          }
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PaintPad</title>
          <style>
              body {
                  padding: 0;
                  margin: 0;
                  color: var(--vscode-foreground);
                  font-family: var(--vscode-font-family);
              }
              #paint-app {
                  display: flex;
                  flex-direction: column;
                  height: 100vh;
              }
              #toolbar {
                  display: flex;
                  flex-wrap: wrap;
                  padding: 10px;
                  background-color: var(--vscode-editor-background);
                  border-bottom: 1px solid var(--vscode-panel-border);
              }
              #canvas-container {
                  position: relative;
                  flex-grow: 1;
              }
              #canvas {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border: 1px solid var(--vscode-panel-border);
              }
              #size-indicator {
                  position: absolute;
                  pointer-events: none;
                  display: none;
                  border: 2px solid var(--vscode-editor-foreground);
                  border-radius: 50%;
                  opacity: 0.5;
              }
              button {
                  margin-right: 5px;
                  margin-bottom: 5px;
                  padding: 5px 10px;
                  background-color: var(--vscode-button-background);
                  color: var(--vscode-button-foreground);
                  border: none;
                  cursor: pointer;
              }
              button:hover {
                  background-color: var(--vscode-button-hoverBackground);
              }
              .tool-group {
                  display: flex;
                  align-items: center;
                  margin-right: 10px;
                  margin-bottom: 5px;
              }
              .tool-group label {
                  margin-right: 5px;
              }
              input[type="range"] {
                  width: 100px;
              }
              #color-picker {
                  margin-right: 10px;
              }
          </style>
      </head>
      <body>
          <div id="paint-app">
              <div id="toolbar">
                  <button id="brush">Brush</button>
                  <button id="eraser">Eraser</button>
                  <div class="tool-group">
                      <label for="brush-size">Brush Size:</label>
                      <input type="range" id="brush-size" min="1" max="50" value="2">
                      <span id="brush-size-value">2</span>
                  </div>
                  <div class="tool-group">
                      <label for="eraser-size">Eraser Size:</label>
                      <input type="range" id="eraser-size" min="1" max="50" value="20">
                      <span id="eraser-size-value">20</span>
                  </div>
                  <input type="color" id="color-picker" value="#000000">
                  <button id="clear">Clear</button>
                  <button id="save">Save</button>
              </div>
              <div id="canvas-container">
                  <canvas id="canvas"></canvas>
                  <div id="size-indicator"></div>
              </div>
          </div>
          <script>
              const vscode = acquireVsCodeApi();
              const canvas = document.getElementById('canvas');
              const ctx = canvas.getContext('2d');
              const sizeIndicator = document.getElementById('size-indicator');
              let isDrawing = false;
              let currentTool = 'brush';
              let currentColor = '#000000';
              let brushSize = 2;
              let eraserSize = 20;

              // Set canvas size
              function resizeCanvas() {
                  canvas.width = canvas.clientWidth;
                  canvas.height = canvas.clientHeight;
                  clearCanvas();
              }
              resizeCanvas();
              window.addEventListener('resize', resizeCanvas);

              // Clear canvas
              function clearCanvas() {
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
              }

              // Tool selection
              document.getElementById('brush').addEventListener('click', () => currentTool = 'brush');
              document.getElementById('eraser').addEventListener('click', () => currentTool = 'eraser');
              document.getElementById('color-picker').addEventListener('input', (e) => {
                  currentColor = e.target.value;
              });

              // Size controls
              const brushSizeSlider = document.getElementById('brush-size');
              const brushSizeValue = document.getElementById('brush-size-value');
              brushSizeSlider.addEventListener('input', (e) => {
                  brushSize = parseInt(e.target.value);
                  brushSizeValue.textContent = brushSize;
                  updateSizeIndicator();
              });

              const eraserSizeSlider = document.getElementById('eraser-size');
              const eraserSizeValue = document.getElementById('eraser-size-value');
              eraserSizeSlider.addEventListener('input', (e) => {
                  eraserSize = parseInt(e.target.value);
                  eraserSizeValue.textContent = eraserSize;
                  updateSizeIndicator();
              });

              // Clear functionality
              document.getElementById('clear').addEventListener('click', clearCanvas);

              // Save functionality
              document.getElementById('save').addEventListener('click', () => {
                  const imageData = canvas.toDataURL('image/png');
                  vscode.postMessage({ type: 'save', imageData: imageData });
              });

              // Drawing functions
              canvas.addEventListener('mousedown', startDrawing);
              canvas.addEventListener('mousemove', draw);
              canvas.addEventListener('mouseup', stopDrawing);
              canvas.addEventListener('mouseout', stopDrawing);

              function startDrawing(e) {
                  isDrawing = true;
                  draw(e);
              }

              function draw(e) {
                  updateSizeIndicator(e);
                  if (!isDrawing) return;
                  const rect = canvas.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  ctx.lineWidth = currentTool === 'eraser' ? eraserSize : brushSize;
                  ctx.lineCap = 'round';
                  ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;

                  ctx.lineTo(x, y);
                  ctx.stroke();
                  ctx.beginPath();
                  ctx.moveTo(x, y);
              }

              function stopDrawing() {
                  isDrawing = false;
                  ctx.beginPath();
                  sizeIndicator.style.display = 'none';
              }

              function updateSizeIndicator(e) {
                  const size = currentTool === 'eraser' ? eraserSize : brushSize;
                  sizeIndicator.style.width = size + 'px';
                  sizeIndicator.style.height = size + 'px';
                  
                  if (e) {
                      const rect = canvas.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      sizeIndicator.style.left = (x - size / 2) + 'px';
                      sizeIndicator.style.top = (y - size / 2) + 'px';
                  }

                  sizeIndicator.style.display = 'block';
              }

              // Show size indicator on mouse enter
              canvas.addEventListener('mouseenter', (e) => {
                  updateSizeIndicator(e);
              });

              // Hide size indicator on mouse leave
              canvas.addEventListener('mouseleave', () => {
                  sizeIndicator.style.display = 'none';
              });
          </script>
      </body>
      </html>
    `;
  }
}