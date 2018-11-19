import React, { Component } from 'react';
import {Row, Col, Grid} from 'react-bootstrap';

import '../App.css';
import Header from './Header';
import TimelockBody from './TimelockBody';


let regeneratorRuntime =  require("regenerator-runtime");
 

class IxoTimelockApp extends Component {

    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                    <Header  />
                    </Col>
                </Row>
                <Row>
                <Col>
                    <TimelockBody />
                </Col>
                </Row>
            </Grid>
        );
    }
}


export default IxoTimelockApp;