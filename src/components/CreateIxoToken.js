
import React, { Component } from 'react';

import {
    Button
  } from 'react-bootstrap';

class CreateIxoToken extends Component {

    state = {
        pending:false,
        handleCreateIxoToken : this.props.handleCreateIxoToken
    }


    render(){
        return <div>
            {this.renderButton()}        
        </div>
        
    };

    renderButton = () => {
        if(this.state.pending){
            return (
                <Button disabled>Pending ...</Button>
            )
        }
        return (
            <Button onClick={() => {
                this.state.handleCreateIxoToken()
                this.setState({pending: true})
            }}>Create the IXO Token</Button>
        )}

};
export default CreateIxoToken;