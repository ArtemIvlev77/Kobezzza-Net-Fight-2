import { controlsEmitter } from "modules/ControlsEmitter";
import { BaseScene } from "../BaseScene";

const characterList = [
  {
    id: 1,
    name: 'Character-1',
    previewSprite: '/assets/sprites/character-1/preview.png',
  },
  {
    id: 2,
    name: 'Character-2',
    previewSprite: '/assets/sprites/character-2/preview.png',
  },
]

const config = {
  container: {
    border: 2,
  },
  card: {
    width: 80,
    height: 80,
    indent: 10,
    preview: {
      width: 223,
      height: 223,
    }
  },
  font: {
    size: 32,
    offset: 10,
  }
}

class Gamer {
  character: {
    id: number;
    next: number;
    prev: number;
  };
  characterList: {
    id: number;
    next: number;
    prev: number;
  }[];
  isHost: boolean;
  connected: boolean;

  constructor({ isHost, connected, id }: {
    isHost: boolean;
    connected: boolean;
    id?: number;
  }) {
    // TODO think about generation from list
    this.characterList = [
      {
        id: 1,
        next: 2,
        prev: 2,
      },
      {
        id: 2,
        next: 1,
        prev: 1,
      }
    ]
    this.isHost = isHost
    this.connected = connected
    const defaultCharacter = this.characterList[0]
    this.character = this.characterList.find((character) => character.id === id) || defaultCharacter
  }

  get isEnemy() {
    return !this.isHost
  }

  get id() {
    return this.character.id
  }

  toggleToNext() {
    const newState = this.characterList.find(({ id }) => id === this.character.next)!
    this.character = newState
  }

  toggleToPrev() {
    const newState = this.characterList.find(({ id }) => id === this.character.prev)!
    this.character = newState
  }
}

export class MainScene extends BaseScene {
  isHost: boolean;
  connected: boolean;
  player: Gamer;
  enemy: Gamer;
  characterSprites: HTMLImageElement[];

  constructor({ canvas, isHost, connected }: {
    canvas: HTMLCanvasElement | null,
    isHost: boolean,
    connected: boolean,
  }) {
    super(canvas)

    this.isHost = isHost;
    this.connected = connected;
    this.player = new Gamer({ isHost, connected })
    this.enemy = new Gamer({ isHost: !isHost, connected })
    this.characterSprites = characterList.map((item) => {
      const img = new Image();
      img.src = item.previewSprite;
      return img
    })
    this.toggleToPrev = this.toggleToPrev.bind(this)
    this.toggleToNext = this.toggleToNext.bind(this)
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

  // TODO add logic for different drawing for player & enemy
  // (current choice, another player is active)
  drawSelectCharacterContainer({
    offset, character, title,
  }: {
    offset: { x: number, y: number },
    character: Gamer,
    title: string,
  }) {
    const _ctx = this.ctx
    if (_ctx) {
      const containerSize = this.#getPlayerContainerSize()

      // Render title
      _ctx.font = `${config.font.size}px megapixel`;
      _ctx.fillStyle = "#fff";
      _ctx.textBaseline = "top";
      _ctx.textAlign = "center";
      _ctx.fillText(
        title,
        offset.x + (containerSize.width / 2),
        offset.y - config.font.size - config.font.offset
      );

      // Render container border
      _ctx.globalAlpha = 1.0;
      _ctx.strokeStyle = "#fff";
      _ctx.lineWidth = 2;
      _ctx.strokeRect(offset.x, offset.y, containerSize.width, containerSize.height);
      _ctx.strokeStyle = "#000";

      // Render character cards
      characterList.forEach((characterCard, index) => {
        // Position depend from multiple params
        const xPos = offset.x + (config.card.indent * (index + 1)) + (config.card.width * index) + config.container.border
        const yPos = offset.y + config.card.indent + config.container.border
        // Render character card back
        _ctx.globalAlpha = 0.5;
        _ctx.fillStyle = "#fff";
        _ctx.fillRect(
          xPos,
          yPos,
          config.card.width,
          config.card.height,
        )
        _ctx.globalAlpha = 1.0;
        if (character.id === characterCard.id) {
          // Render character border
          _ctx.strokeStyle = "#fff";
          _ctx.strokeRect(
            xPos,
            yPos,
            config.card.width,
            config.card.height,
          );
          _ctx.strokeStyle = "#000";
        }
        // Render character preview image
        // const characterImg = new Image();
        // characterImg.src = characterCard.previewSprite;
        // characterImg.onload = () => {
        this.ctx?.drawImage(
          this.characterSprites[index],
          xPos - 70,
          yPos - 70,
          config.card.preview.width,
          config.card.preview.height,
        );
        // };
      })
    }
  }

  drawSelectPlayer() {
    this.drawSelectCharacterContainer({
      offset: { x: 200, y: 380 },
      character: this.player,
      title: 'Player 1',
    })
  }

  drawSelectEnemy() {
    this.drawSelectCharacterContainer({
      offset: { x: 966, y: 380 },
      character: this.enemy,
      title: 'Player 2',
    })
  }

  // TODO add logic for drawing arena select block
  drawSelectArena() { }

  draw() {
    console.log('MainScene draw triggered');
    if (this.canvas) {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBg()
      this.drawTitle()
      this.drawSelectPlayer()
      this.drawSelectEnemy()
      this.drawSelectArena()
    }
  }

  update() {
    this.drawBg()
    this.drawTitle()
    this.drawSelectPlayer()
    this.drawSelectEnemy()
    this.drawSelectArena()
  }

  toggleToPrev() {
    // TODO add logic for arena case
    const target = this.isHost ? this.player : this.enemy
    target.toggleToPrev()
  }

  toggleToNext() {
    // TODO add logic for arena case
    const target = this.isHost ? this.player : this.enemy
    target.toggleToNext()
  }

  init() {
    controlsEmitter.on('moveLeft', this.toggleToPrev)
    controlsEmitter.on('moveRight', this.toggleToNext)
  }

  exit() {
    controlsEmitter.off('moveLeft', this.toggleToPrev)
    controlsEmitter.off('moveRight', this.toggleToNext)
  }
}
