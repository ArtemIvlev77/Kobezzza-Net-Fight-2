import { ToggleableList, ToggleableItemRawI } from './ToggleableList';

describe('ToggleableList', () => {
  const rawList: ToggleableItemRawI[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];

  let toggleableList: ToggleableList;

  beforeEach(() => {
    toggleableList = new ToggleableList({ list: rawList });
  });

  it('should initialize with the first item as current', () => {
    expect(toggleableList.current.id).toBe(rawList[0].id);
  });

  it('should set current item by id', () => {
    toggleableList.setById(2);
    expect(toggleableList.current.id).toBe(2);
  });

  it('should toggle to the next item', () => {
    toggleableList.toggleToNext();
    expect(toggleableList.current.id).toBe(rawList[1].id);
  });

  it('should toggle to the previous item', () => {
    toggleableList.toggleToPrev();
    expect(toggleableList.current.id).toBe(rawList[rawList.length - 1].id);
  });
});