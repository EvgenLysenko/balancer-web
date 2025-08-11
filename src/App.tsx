import React from 'react';
import { Provider } from "react-redux";
import configureStore from "./state";
import { Main } from './components/main/Main';
import './App.css';


const initialState = (window as any).initialReduxState;
const store = configureStore(initialState);

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>
    )
}

export default App;
