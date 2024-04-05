import './App.css';

import { Provider } from 'react-redux';
import store from './store/store';
import Weather from './components/Weather';

function App() {
  return (
    <Provider className="App" store={store}>
      <Weather/>
    </Provider>
  );
}

export default App;
