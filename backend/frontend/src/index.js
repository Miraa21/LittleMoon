import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './bootstrap.min.css'
import './index.css';
import store from './store'
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
reportWebVitals();