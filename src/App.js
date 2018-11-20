import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import './index.css';
import IxoTimelockApp from './components/IxoTimelockApp';
import InstallMetaMask from './components/install-metamask/install-metamask-component.jsx';
let regeneratorRuntime =  require("regenerator-runtime");

class App extends Component {

    state = {
        web3Obj:null
    }
    componentDidUpdate(prevprops) {
        if (prevprops != this.props){
            this.setState({web3Obj: this.props.web3Obj})
        }
    }
    componentDidMount(){
        window.addEventListener('load', async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    this.setState({web3Obj: window.web3})
                } catch (error) {
                    // User denied account access...
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                this.setState({web3Obj: window.web3})
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        });
    }


    render() {
         if(this.state.web3Obj) {
            return <IxoTimelockApp/>
        }else return <InstallMetaMask/>
    }
  }



  export default App;
  
  const wrapper = document.getElementById("root");
  wrapper ? ReactDOM.render(<App />, wrapper) : false;