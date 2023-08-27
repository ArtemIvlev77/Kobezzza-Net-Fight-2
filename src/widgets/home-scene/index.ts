const HOME_BG_URL = "/assets/sprites/home-bg.png"

const drawTitle = (
  ctx: CanvasRenderingContext2D | null | undefined
) => {
  if (ctx) {
    ctx.font = "64px megapixel";
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText("FIGHTING", 680, 150);
  }
};

const drawStartText = (
  ctx: CanvasRenderingContext2D | null | undefined
) => {
  if (ctx) {
    ctx.font = "48px megapixel";
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText("Press F for start", 680, 500);
  }
};

const drawBg = (
  canvas: HTMLCanvasElement | null,
  imgBg: HTMLImageElement,
) => {
  if (canvas && imgBg) {
    const ctx = canvas.getContext("2d");

    const hRatio = canvas?.width / imgBg.width;
    const vRatio = canvas?.height / imgBg.height;
    const ratio = Math.min(hRatio, vRatio);
    ctx?.drawImage(
      imgBg,
      0,
      0,
      imgBg.width,
      imgBg.height,
      0,
      0,
      imgBg.width * ratio,
      imgBg.height * ratio
    );
  }
}

export const drawHomeScene = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas?.getContext("2d");

  const imgBg = new Image();
  imgBg.src = HOME_BG_URL;

  imgBg.onload = function () {
    drawBg(canvas, imgBg);

    drawTitle(ctx);
    drawStartText(ctx);
  };
}