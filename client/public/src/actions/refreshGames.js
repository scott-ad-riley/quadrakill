export default function refreshGames (games) {
  return {
    type: 'REFRESH_GAMES',
    games: games
  }
}
