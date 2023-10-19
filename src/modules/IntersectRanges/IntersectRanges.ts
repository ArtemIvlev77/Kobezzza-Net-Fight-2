interface IIntersectRanges {
  intersection(): string
  set setRanges1(ranges: string)
  set setRanges2(ranges: string)
}

export class IntersectRanges implements IIntersectRanges {
  private ranges1: number[][]
  private ranges2: number[][]

  constructor(ranges1: string, ranges2: string) {
    this.ranges1 = this.normalize(ranges1)
    this.ranges2 = this.normalize(ranges2)
  }

  intersection(): string {
    const
      intersections: number[][] = []

    let
      i1 = 0,
      i2 = 0

    while(i1 < this.ranges1.length && i2 < this.ranges2.length) {
      const
        range1 = this.ranges1[i1],
        range2 = this.ranges2[i2]
  
      const intersection = this.getIntersection(range1, range2)
  
      if (intersection != null) {
        intersections.push(intersection)
      }
  
      if (range1[1] < range2[1]) {
        i1++
        continue
      }
  
      if (range1[1] > range2[1]) {
        i2++
        continue
      }
  
      i1++
      i2++
    }

    return intersections.map(range => range.join('-')).join('; ')
  }

  set setRanges1(ranges: string) {
    this.ranges1 = this.normalize(ranges)
  }

  set setRanges2(ranges: string) {
    this.ranges2 = this.normalize(ranges)
  }

  private normalize(ranges: string): number[][] {
    return ranges.split(/\s*;\s*/).map(el => el.split('-').map(el => parseInt(el)))
  }

  private getIntersection(range1: number[], range2: number[]) {
    const
      [l1, r1] = range1,
      [l2, r2] = range2,
      maxL = Math.max(l1, l2),
      minR = Math.min(r1, r2)

    if (maxL <= minR) {
      return [maxL, minR]
    }

    return null
  }
}
