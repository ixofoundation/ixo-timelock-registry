import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import './index.css';
import IxoTimelockApp from './components/IxoTimelockApp';
import InstallMetaMask from './components/install-metamask/install-metamask-component.jsx';

class App extends Component {

    render() {
      const { web3 } = window;
      return web3?(<IxoTimelockApp/>):(<InstallMetaMask/>);
    }
  }
  export default App;
  
  const wrapper = document.getElementById("root");
  wrapper ? ReactDOM.render(<App />, wrapper) : false;