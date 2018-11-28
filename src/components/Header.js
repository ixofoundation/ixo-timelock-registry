import React, { Component } from 'react';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
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
            <LinkContainer to="/createToken">
                <NavItem>CreateToken</NavItem>
            </LinkContainer>
        </Nav>
        <Nav>
            <LinkContainer to="/timelock">
                <NavItem>Timelock</NavItem>
            </LinkContainer>
        </Nav>

      </Navbar>
    );
  }
}


export default Header;
