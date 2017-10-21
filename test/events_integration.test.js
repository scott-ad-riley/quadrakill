import { IN as serverIn, OUT as serverOut } from '../server/events'
import { IN as clientIn, OUT as clientOut } from '../client/public/src/canvas/events'

describe('Events going from server to client', function () {
  it('matches for UPDATE_PLAYERS', function () {
    expect(serverOut.UPDATE_PLAYERS).toEqual(clientIn.UPDATE_PLAYERS)
  })
  it('matches for UPDATE_PLAYER', function () {
    expect(serverOut.UPDATE_PLAYER).toEqual(clientIn.UPDATE_PLAYER)
  })
  it('matches for CREATE_BULLET', function () {
    expect(serverOut.CREATE_BULLET).toEqual(clientIn.CREATE_BULLET)
  })
  it('matches for REMOVE_WEAPON', function () {
    expect(serverOut.REMOVE_WEAPON).toEqual(clientIn.REMOVE_WEAPON)
  })
  it('matches for REMOVE_ITEM', function () {
    expect(serverOut.REMOVE_ITEM).toEqual(clientIn.REMOVE_ITEM)
  })
  it('matches for PLAYER_TAKE_DAMAGE', function () {
    expect(serverOut.PLAYER_TAKE_DAMAGE).toEqual(clientIn.PLAYER_TAKE_DAMAGE)
  })
  it('matches for REMOTE_PLAYER_DIED', function () {
    expect(serverOut.REMOTE_PLAYER_DIED).toEqual(clientIn.REMOTE_PLAYER_DIED)
  })
  it('matches for GAMES_REFRESH', function () {
    expect(serverOut.GAMES_REFRESH).toEqual(clientIn.GAMES_REFRESH)
  })
  it('matches for JOIN_GAME', function () {
    expect(serverOut.JOIN_GAME).toEqual(clientIn.JOIN_GAME)
  })
  it('matches for QUIT_GAME', function () {
    expect(serverOut.QUIT_GAME).toEqual(clientIn.QUIT_GAME)
  })
  it('matches for DISCONNECT', function () {
    expect(serverOut.DISCONNECT).toEqual(clientIn.DISCONNECT)
  })
})
