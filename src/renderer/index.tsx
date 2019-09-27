import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto/index.css';
import { error, catchErrors } from 'electron-log';
import { Root } from './components/root';

ReactDOM.render(<Root />, document.querySelector('#app'));

// window.onerror = (ev, s, err) => {
//   error(err);
// }
catchErrors({});
