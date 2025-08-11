import { applyMiddleware, createStore, Store } from "redux";
import { IApplicationState, rootReducer, rootSaga } from "./ducks";
import { composeWithDevTools } from 'redux-devtools-extension';
import sagaMiddleware from "./middlewares/sagas";

export default function configureStore(
    initialState: IApplicationState
): Store<IApplicationState> {
    const middlewares = applyMiddleware(sagaMiddleware);

    const store = createStore(rootReducer, initialState,  composeWithDevTools(middlewares));
    sagaMiddleware.run(rootSaga);

    return store;
}
