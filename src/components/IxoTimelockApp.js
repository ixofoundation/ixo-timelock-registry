import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import '../App.css';
import TimelockBody from './TimelockBody';
import CreateToken from './CreateToken';



let regeneratorRuntime =  require("regenerator-runtime");
 

class IxoTimelockApp extends Component {

    render() {
        return (
            <Switch>
                {/* <Route exact path='/' component={Home}/> */}
                <Route path='/createToken' component={CreateToken}/>
                <Route path='/timelock' component={TimelockBody}/>
            </Switch>
        );
    }
}


export default IxoTimelockApp;