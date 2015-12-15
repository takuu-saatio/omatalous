import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import reducer from "./reducers"

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

export default function configureStore(initialState, reducers) {
  
  if (!reducers) {
    reducers = [];
  }

  const store = createStoreWithMiddleware(reducer(reducers), initialState)

  /* 
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }
  */
  return store

}
