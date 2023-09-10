import { ToggleableList } from "shared/lib/ToggleableList";
import { characterList, config } from "./config";

export class MainSceneGamer {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;
  type: 'player' | 'enemy';
  list: ToggleableList;
  isHost: boolean;
  isReady: boolean;
  connected: boolean;
  characterSprites: HTMLImageElement[];

  constructor({ canvas, isHost, connected, type }: {
    canvas: HTMLCanvasElement | null,
    isHost: boolean;
    connected: boolean;
    type: 'player' | 'enemy';
  }) {
    this.canvas = canvas
    this.ctx = canvas?.getContext("2d");
    this.list = new ToggleableList({ list: characterList })
    this.isHost = isHost
    this.connected = connected
    this.type = type
    this.isReady = false
    this.characterSprites = characterList.map((item) => {
      const img = new Image();
      img.src = item.previewSprite;
      return img
    })

    this.setById = this.setById.bind(this)
    this.toggleToNext = this.toggleToNext.bind(this)
    this.toggleToPrev = this.toggleToPrev.bind(this)
    this.setConnected = this.setConnected.bind(this)
  }

  get isEnemy() {
    return this.type === 'enemy'
  }

  get id() {
    return this.list.current.id
  }

  setById(newId: number) {
    this.list.setById(newId)
  }

  toggleToNext() {
    // TODO think about lock only for enemy controls
    if (this.isReady) return
    this.list.toggleToNext()
  }

  toggleToPrev() {
    // TODO think about lock only for enemy controls
    if (this.isReady) return
    this.list.toggleToPrev()
  }

  setConnected(state: boolean) {
    this.connected = state
  }

  toggleReady() {
    if (!this.connected) return
    this.isReady = !this.isReady
  }

  setReady(state: boolean) {
    this.isReady = state
  }

  #getPlayerContainerSize(): {
    width: number;
    height: number;
  } {
    // It's only 1 row character select
    const borderSize = config.container.border * 2
    const cardWidth = (characterList.length * config.card.width)
    const indentWidth = (characterList.length + 1) * config.card.indent
    const cardHeight = config.card.height
    const indentHeight = config.card.indent * 2

    return {
      width: cardWidth + indentWidth + borderSize,
      height: cardHeight + indentHeight + borderSize
    }
  }

  draw({
    offset, title,
  }: {
    offset: { x: number, y: number },
    title: string,
  }) {
    const isEnemy = this.isEnemy
    const isDisabled = this.isReady || (!this.connected && isEnemy)
    const _ctx = this.ctx

    if (_ctx) {
      const containerSize = this.#getPlayerContainerSize()

      const drawTitle = () => {
        _ctx.font = `${config.font.size}px megapixel`;
        _ctx.fillStyle = `rgba(255, 255, 255, ${isDisabled ? 0.5 : 1})`;
        _ctx.textBaseline = "top";
        _ctx.textAlign = "center";
        _ctx.fillText(
          title,
          offset.x + (containerSize.width / 2),
          offset.y - config.font.size - config.font.offset
        );
      }
      drawTitle()

      const drawContainerBorder = () => {
        _ctx.globalAlpha = 1.0;
        _ctx.strokeStyle = `rgba(255, 255, 255, ${isDisabled ? 0.5 : 1})`;
        _ctx.lineWidth = 2;
        _ctx.strokeRect(offset.x, offset.y, containerSize.width, containerSize.height);
        _ctx.strokeStyle = "#000";
      }
      drawContainerBorder()

      const drawCharacterCards = () => {
        characterList.forEach((characterCard, index) => {
          // Position depend from multiple params
          const xPos = offset.x + (config.card.indent * (index + 1)) + (config.card.width * index) + config.container.border
          const yPos = offset.y + config.card.indent + config.container.border

          const drawBack = () => {
            _ctx.globalAlpha = 0.5;
            _ctx.fillStyle = `rgba(255, 255, 255, ${isDisabled ? 0.5 : 1})`;
            _ctx.fillRect(
              xPos,
              yPos,
              config.card.width,
              config.card.height,
            )
            _ctx.globalAlpha = 1.0;
          }
          drawBack()

          const drawSelectedBorder = () => {
            if (
              this.id === characterCard.id && !isDisabled
              || this.id === characterCard.id && this.isReady
            ) {
              _ctx.strokeStyle = `rgba(255, 255, 255, ${isDisabled ? 0.5 : 1})`;
              _ctx.strokeRect(
                xPos,
                yPos,
                config.card.width,
                config.card.height,
              );
            }
          }
          drawSelectedBorder()

          const drawPreviewImage = () => {
            this.ctx?.drawImage(
              this.characterSprites[index],
              xPos - 70,
              yPos - 70,
              config.card.preview.width,
              config.card.preview.height,
            );
          }
          drawPreviewImage()
        })
      }
      drawCharacterCards()

      const drawCardPlayerStatus = () => {
        const text = this.connected && this.type === 'player'
          ? 'Host'
          : this.connected && this.type === 'enemy'
            ? 'Connected'
            : undefined
        if (text) {
          _ctx.font = `${config.font.smallSize}px megapixel`;
          _ctx.fillStyle = "#fff";
          _ctx.textBaseline = "top";
          _ctx.textAlign = "center";
          _ctx.fillText(
            text,
            offset.x + (containerSize.width / 2),
            offset.y + containerSize.height + config.font.offset
          );
        }
      }
      drawCardPlayerStatus()

      const drawPlayerReadyText = () => {
        const readyText = this.connected && this.isReady ? 'Ready' : undefined
        if (readyText) {
          // Draw right from container
          const posXPlayer = offset.x + (containerSize.width) + (config.card.indent * 2)
          // Draw left from container
          const posXEnemy = offset.x - (config.card.indent * 2)
          const posX = this.isEnemy ? posXEnemy : posXPlayer
          const posY = offset.y + (containerSize.height / 2) - config.font.offset
          _ctx.font = `${config.font.smallSize}px megapixel`
          _ctx.fillStyle = "#fff"
          _ctx.textBaseline = "top"
          _ctx.textAlign = "center"
          _ctx.fillText(
            readyText,
            posX,
            posY,
          )
        }
      }
      drawPlayerReadyText()
    }
  }
}
