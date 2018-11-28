import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import './index.css';
import {Row, Col, Grid} from 'react-bootstrap';
import Header from './components/Header';
import IxoTimelockApp from './components/IxoTimelockApp';

import InstallMetaMask from './components/install-metamask/install-metamask-component.jsx';
import {
    Alert
  } from 'react-bootstrap';
  

let regeneratorRuntime =  require("regenerator-runtime");

class App extends Component {

    state = {
        web3Obj:null,
        pendingEnable: true,
        acceptedEnable: false
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
                    this.setState({pendingEnable: true})
                    ethereum.enable().then((res) => {
                        console.log(`Connect Result : ${res}`)
                        this.setState({web3Obj: window.web3, pendingEnable: false, acceptedEnable: true})
                    });
                } catch (error) {
                    // User denied account access...
                    this.setState({web3Obj: null, pendingEnable: false, acceptedEnable: false})                    
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
        if(this.state.pendingEnable) {
            return <Alert color="primary">Awaiting MetaMask enable, please check your MetaMask account ...</Alert>
        }else if(!this.state.acceptedEnable) {
            return <Alert color="danger">MetaMask connect rejected!</Alert>
        }
         if(this.state.web3Obj) {
            return (<Grid>
                        <Row>
                            <Col>
                                <Header  />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <IxoTimelockApp />
                            </Col>
                        </Row>
                    </Grid>)
        }else return <InstallMetaMask/>
    }
  }



  export default App;
  
  const wrapper = document.getElementById("root");
  wrapper ? ReactDOM.render(<App />, wrapper) : false;