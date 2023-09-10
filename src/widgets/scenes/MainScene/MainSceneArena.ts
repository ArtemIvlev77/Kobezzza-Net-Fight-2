import { ToggleableList } from "shared/lib/ToggleableList";
import { arenaList, config } from "./config";

export class MainSceneArena {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;
  list: ToggleableList;
  arenaSprites: HTMLImageElement[];
  isHost: boolean;
  connected: boolean;

  constructor({ canvas, isHost, connected }: {
    canvas: HTMLCanvasElement | null,
    isHost: boolean,
    connected: boolean,
  }) {
    this.canvas = canvas
    this.ctx = canvas?.getContext("2d");
    this.list = new ToggleableList({ list: arenaList })

    this.arenaSprites = arenaList.map((item) => {
      const img = new Image();
      img.src = item.previewSprite;
      return img
    })

    this.isHost = isHost;
    this.connected = connected;

    this.draw = this.draw.bind(this)
  }

  get id() {
    return this.list.current.id
  }

  #getArenaContainerSize(): {
    width: number;
    height: number;
  } {
    // It's only 1 row arena select
    const borderSize = config.container.border * 2
    const cardWidth = (arenaList.length * config.arena.width)
    const indentWidth = (arenaList.length + 1) * config.arena.indent.x
    const cardHeight = config.arena.height
    const indentHeight = config.arena.indent.y * 2

    return {
      width: cardWidth + indentWidth + borderSize,
      height: cardHeight + indentHeight + borderSize
    }
  }

  setById(newId: number) {
    this.list.setById(newId)
  }

  toggleToNext() {
    this.list.toggleToNext()
  }

  toggleToPrev() {
    this.list.toggleToPrev()
  }

  draw() {
    const _ctx = this.ctx
    if (_ctx && this.canvas) {
      const containerSize = this.#getArenaContainerSize()
      const offset = {
        x: (this.canvas.width - containerSize.width) / 2,
        y: 620,
      }

      const drawTitle = () => {
        _ctx.font = `${config.font.size}px megapixel`;
        _ctx.fillStyle = "#fff";
        _ctx.textBaseline = "top";
        _ctx.textAlign = "center";
        _ctx.fillText(
          'Arena',
          offset.x + (containerSize.width / 2),
          offset.y - config.font.size - config.font.offset
        );
      }
      drawTitle()

      const drawContainerBorder = () => {
        _ctx.globalAlpha = 1.0;
        _ctx.strokeStyle = "#fff";
        _ctx.lineWidth = 2;
        _ctx.strokeRect(offset.x, offset.y, containerSize.width, containerSize.height);
        _ctx.strokeStyle = "#000";
      }
      drawContainerBorder()

      const drawArenaPreviews = () => {
        arenaList.forEach((arenaItem, index) => {
          // Position depend from multiple params
          const xPos = offset.x + (config.arena.indent.x * (index + 1)) + (config.arena.width * index) + config.container.border
          const yPos = offset.y + config.arena.indent.y + config.container.border

          // Draw arena preview back
          const drawBack = () => {
            _ctx.globalAlpha = 0.5;
            _ctx.fillStyle = "#fff";
            _ctx.fillRect(
              xPos,
              yPos,
              config.arena.width,
              config.arena.height,
            )
            _ctx.globalAlpha = 1.0;
          }
          drawBack()

          const drawSelectedBorder = () => {
            // TODO add supporting "block arena is active" state
            if (this.id === arenaItem.id) {
              _ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
              _ctx.strokeRect(
                xPos,
                yPos,
                config.arena.width,
                config.arena.height,
              );
            }
          }
          drawSelectedBorder()

          const drawPreviewImage = () => {
            this.ctx?.drawImage(
              this.arenaSprites[index],
              xPos,
              yPos,
              config.arena.width,
              config.arena.height,
            );
          }
          drawPreviewImage()
        })
      }
      drawArenaPreviews()
    }
  }
}