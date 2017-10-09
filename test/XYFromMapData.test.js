import XYFromMapData from '../lib/XYFromMapData'
import mapData from './support/mapData'

describe('XYFromMapData', function () {
  it('returns the correct position for player 1', function () {
    expect(XYFromMapData(mapData, 1)).toEqual({ x: 32, y: 32 })
  })
  it('returns the correct position for player 2', function () {
    expect(XYFromMapData(mapData, 2)).toEqual({ x: 704, y: 32 })
  })
  it('returns the correct position for player 3', function () {
    expect(XYFromMapData(mapData, 3)).toEqual({ x: 32, y: 448 })
  })
  it('returns the correct position for player 4', function () {
    expect(XYFromMapData(mapData, 4)).toEqual({ x: 704, y: 448 })
  })
})
