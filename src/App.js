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
        network:null,
        web3Obj:null,
        loading: true,
        pendingEnable: true,
        acceptedEnable: false
    }
    componentDidUpdate(prevprops) {
        if (prevprops.web3Obj != this.props.web3Obj){
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
                        this.setState({web3Obj: window.web3, pendingEnable: false, acceptedEnable: true, loading: false})
                    });
                } catch (error) {
                    // User denied account access...
                    this.setState({web3Obj: null, pendingEnable: false, acceptedEnable: false, loading: false})                    
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                this.setState({web3Obj: window.web3, pendingEnable: false, loading: false})
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
                this.setState({web3Obj: null, pendingEnable: false, loading: false})

            }
        });
    }

    setHeaderNetwork = (network) => {
        this.setState({network})
    }

    render() {
        
        if(!this.setState.loading && this.state.pendingEnable) {
            return <Alert color="primary">Awaiting MetaMask enable, please check your MetaMask account ...</Alert>
        }else if(!this.setState.loading && !this.state.acceptedEnable) {
            return <Alert color="danger">MetaMask connect rejected!</Alert>
        }
         if(this.state.web3Obj) {
            return (<Grid>
                        <Row>
                            <Col>
                                <Header  network={this.state.network}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <IxoTimelockApp setHeaderNetwork={this.setHeaderNetwork}/>
                            </Col>
                        </Row>
                    </Grid>)
        }else return <InstallMetaMask/>
    }
  }



  export default App;
  
  const wrapper = document.getElementById("root");
  wrapper ? ReactDOM.render(<App />, wrapper) : false;