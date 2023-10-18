import { IntersectRanges } from './IntersectRanges'

describe('IntersectRanges', () => {
  let intersectRanges: IntersectRanges

  beforeEach(() => {
    intersectRanges = new IntersectRanges('1-2; 4-6; 9-11', '1-5; 10-14; 15');
  })

  it('must find an intersection with the ranges "1-2; 4-6; 9-11" and "1-5; 10-14; 15"', () => {
    expect(intersectRanges.intersection()).toBe('1-2; 4-5; 10-11')
  })

  it('change range1 on "1-2; 9-11" and find an intersection', () => {
    intersectRanges.setRanges1 = '1-2; 9-11'
    expect(intersectRanges.intersection()).toBe('1-2; 10-11')
  })

  it('change range2 on "1-3; 8-17; 20-25" and find an intersection', () => {
    intersectRanges.setRanges2 = '1-3; 8-17; 20-25'
    expect(intersectRanges.intersection()).toBe('1-2; 9-11')
  })
})
