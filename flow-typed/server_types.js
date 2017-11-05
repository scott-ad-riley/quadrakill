import type EventEmitter from 'events'

declare type gameName = string
declare type gameInfo = [number, number]
declare type gameSetupData = {
  name: string,
  height: number,
  width: number,
}
declare class Engine {
  eventEmitter: EventEmitter;
}
