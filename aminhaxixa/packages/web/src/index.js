import * as React from 'react';
import { render } from 'react-dom';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// eslint-disable-next-line  import/extensions, import/no-unresolved
//import 'backend_reload';

import Main from './Main';
 
const root = document.getElementById('root');

let frontendReloadCount = 0;

const renderApp = ({ key }) => render(<Main rootTag={root} key={key} />, root);

renderApp({ key: frontendReloadCount });
 