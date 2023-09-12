export interface Config {
  container: {
    border: number;
  };
  card: {
    width: number;
    height: number;
    indent: number;
    preview: {
      width: number;
      height: number;
    };
  };
  arena: {
    width: number;
    height: number;
    indent: {
      x: number;
      y: number;
    };
  };
  font: {
    size: number,
    smallSize: number,
    offset: number,
  };
}

export const config: Config = {
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
  arena: {
    width: 140,
    height: 100,
    indent: {
      x: 20,
      y: 10,
    },
  },
  font: {
    size: 32,
    smallSize: 20,
    offset: 10,
  }
}

export const characterList = [
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

export const arenaList = [
  {
    id: 1,
    name: 'Arena-1',
    previewSprite: '/assets/sprites/arena-1.png',
  },
  {
    id: 2,
    name: 'Arena-2',
    previewSprite: '/assets/sprites/arena-2.png',
  },
]
