// For debug drawing element position
export const drawGrid = ({
  canvas,
  padding = 0,
  cellQty = {
    x: 20,
    y: 12,
  },
}: {
  canvas: HTMLCanvasElement | null;
  padding?: number,
  cellQty?: {
    x: number;
    y: number;
  },
}) => {
  const context = canvas?.getContext("2d");
  if (canvas && context) {
    const screenWidth = canvas.width
    const screenHeight = canvas.height
    const stepX = screenWidth / cellQty.x
    const stepY = screenHeight / cellQty.y

    for (let x = 0; x <= screenWidth; x += stepX) {
      context.moveTo(0.5 + x + padding, padding);
      context.lineTo(0.5 + x + padding, screenHeight + padding);
    }

    for (let y = 0; y <= screenHeight; y += stepY) {
      context.moveTo(padding, 0.5 + y + padding);
      context.lineTo(screenWidth + padding, 0.5 + y + padding);
    }

    context.lineWidth = 1;
    context.strokeStyle = "lightblue";
    context.stroke();
  }
}