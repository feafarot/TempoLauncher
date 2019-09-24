import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './components/root';
import 'typeface-roboto/index.css';
import { error, catchErrors } from 'electron-log';

ReactDOM.render(<Root />, document.querySelector('#app'));

// window.onerror = (ev, s, err) => {
//   error(err);
// }
catchErrors({});
