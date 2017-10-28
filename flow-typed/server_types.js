declare type gameName = string
declare type gameInfo = [number, number]
declare type gameSetupData = {
  name: string,
  height: number,
  width: number,
}
declare class Game {
  maxPlayers: number;
  playerCount(): number;
}
declare class GamesList {
  games: { [gameName]: Game };
  forEach(callback: (Game) => any): void;
  list(): { [gameName]: [number, number] };
}
declare class Engine {
  eventEmitter: EventEmitter;
}
