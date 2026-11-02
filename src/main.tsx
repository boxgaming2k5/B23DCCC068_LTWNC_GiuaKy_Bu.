import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Không tìm thấy phần tử root trong index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

