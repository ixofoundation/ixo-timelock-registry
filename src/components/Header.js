import React, { Component } from 'react';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
let regeneratorRuntime =  require("regenerator-runtime");

class Header extends Component {

  constructor (props) {
    super(props);
     this.state = {
        mintixo: this.props.onClickMintIxoSelect,
        managetimelocks: this.props.onClickManageTimelocksSelect
     };
  }

  render() {
    return ( 
    
      <Navbar inverse collapseOnSelect>
        <Navbar.Toggle right="true" onClick={this.toggle} />
        <Navbar.Brand href="#brand">IXO Pre-sale Time Lock</Navbar.Brand>
          <Nav>
            <NavItem onClick={this.state.mintixo} href="#">Mint</NavItem>
            <NavItem onClick={this.state.managetimelocks} href="#">Time locks</NavItem>
          </Nav>
      </Navbar>
    );
  }
}


export default Header;