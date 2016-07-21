// import React from 'react'
// import ReactDOM from 'react-dom'
import { createStore } from 'redux'

import gameReducer from './game-reducer.js'

// Add the reducer to your store on the `routing` key
export default createStore(gameReducer)