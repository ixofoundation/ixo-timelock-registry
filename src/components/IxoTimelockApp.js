import React, { Component, Container } from 'react';
import {Row} from 'react-bootstrap';

import '../App.css';
import Header from './Header';
import TimelockBody from './TimelockBody';

let regeneratorRuntime =  require("regenerator-runtime");
 

class IxoTimelockApp extends Component {
  constructor(props){
    super(props)
    this.state={
        loading: true,
        mintixo: true,
        managetimelocks: false
    }
  }


    onClickMintIxo = async (event) => {
        event.preventDefault();
        this.setState({ mintixo: true, loading: false, managetimelocks: false });
    }

    onClickManageTimelocks = async (event) => {
        event.preventDefault();
        this.setState({ mintixo: false, loading: false, managetimelocks: true});
    }

    render() {
        return (
            <Container>
                <Row>
                    <Header onClickMintIxo={this.onClickMintIxo} onClickManageTimelocks={this.onClickManageTimelocks} />
                </Row>
                <Row>
                    <TimelockBody showIxoMint={this.state.mintixo} showManageTimelocks={this.state.managetimelocks}/>
                </Row>
            </Container>
        );
    }
}
;

export default IxoTimelockApp