import React, { Component } from 'react';

import {
    Alert, Table, ControlLabel, Form, Button, Grid, Row, Col  } from 'react-bootstrap';
import {RELEASE_DATE_FORMAT} from '../config';
import moment from 'moment';
let regeneratorRuntime =  require("regenerator-runtime");
import FileSaver from 'file-saver';

class ListTimelocks extends Component {
 
    state = {
        getIntermediaryBalance: this.props.getIntermediaryBalance,
        intermediaryBalance: null,
        isIntermediary : this.props.isIntermediary,
        beneficiaries : this.props.beneficiaries,
        releaseDate : this.props.releaseDate, 
        onTimelock : this.props.onTimelock, 
        onTransfer : this.props.onTransfer, 
        onQuery : this.props.onQuery, 
        onRelease : this.props.onRelease,
        hasTransfered : this.props.hasTransfered,
        onBeneficiaryFileLoad : this.props.onBeneficiaryFileLoad,
        beneficiariesFile : '',
        pendingTimeLocks: [],
        pendingTransfers: []
      }
    
      componentDidMount(){
        this.setState({loading: true})
            this.state.getIntermediaryBalance().then((balance) => {
            this.setState({loading: false, intermediaryBalance: balance})  
        })
      }

    componentWillReceiveProps(nextProps){
        if(nextProps.beneficiaries !== this.props.beneficiaries){
            this.setState({beneficiaries:nextProps.beneficiaries});
            this.removePendingTimelock()
        }
    }
    render(){
        
        console.log(`this.state.intermediaryBalance ${this.state.intermediaryBalance}`)
        
        return <div>
            {(!this.state.loading && this.state.intermediaryBalance === 0) && (<Row><Alert color="error"> This account does not have IXO Tokens</Alert></Row>)}
            
            {(!this.state.loadsding && this.state.intermediaryBalance > 0) && (<Row><Alert color="error"> This account has {this.state.intermediaryBalance} IXO Tokens</Alert></Row>)}
    
        <Grid>
            <Row>
                <h3>Timelock List with Release Date of {this.state.releaseDate}</h3>
            </Row>
            <Row>
                <Col>
                    <ControlLabel>Load csv Beneficiaries file</ControlLabel>
                </Col>
                <Col>
                    <Form inline>
                        <input type="file" name="file" id="file" className="inputfile" onChange={(e) => {
                            this.state.onBeneficiaryFileLoad(e)
                            this.setState({beneficiariesFile: e.target.files[0]})
                        }} />
                        <label  type="button" htmlFor="file" >Choose a file</label>

                    </Form>
                </Col>
                
            </Row>
            {this.renderChosenFile()}
            <Row>
                {this.renderTable(this.state.beneficiaries, this.state.releaseDate, this.state.onTimelock, this.state.onTransfer, this.state.onQuery, this.state.onRelease)}
                <Button onClick={(e) => this.saveBeneficiariesFile()}>Save</Button>
            </Row>
        </Grid>
        </div>
    }

    renderChosenFile = () => {
        if (this.state.beneficiariesFile) {
            return <Row><Col>File: {this.state.beneficiariesFile.name}</Col></Row>
        }
    }

    renderTable = (beneficiaries, releaseDate, onTimelock, onTransfer, onRelease) => {
        var theMomentOfRelease = moment(releaseDate, RELEASE_DATE_FORMAT);
        var canRelease = false
        if(theMomentOfRelease <= moment()){
            canRelease = true
        }
        if(beneficiaries && Object.entries(beneficiaries).length > 0) {
            return  <div>
                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Address</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Timelock</th>
                                <th>Transfer</th>
                                <th>Release</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(beneficiaries).map((beneficiaryAddress, index) => {
                                    var beneficiary = beneficiaries[beneficiaryAddress]
                                    return (<tr key={index}>
                                                <td>{index}</td>
                                                <td>{beneficiaryAddress}</td>
                                                <td>{beneficiary.name}</td>
                                                <td>{beneficiary.amount}</td>
                                                {this.renderTimelockButton(beneficiary.timelockAddress, beneficiary.address, theMomentOfRelease.unix(), onTimelock)}
                                                {this.renderTransferButton(beneficiary.address, beneficiary.timelockAddress, beneficiary.hasTransfered, beneficiary.amount, beneficiary.txHash, onTransfer)}
                                                {this.renderReleaseButton(beneficiaryAddress,beneficiary.amount, beneficiary.timelockAddress, canRelease, onRelease)}
                                        </tr>);
                                    })
                                }        
                            </tbody>
                        </Table>
                    </div>
        } else return <div><h3>There are no Beneficiaries loaded, please load file ...</h3></div>

    }

    renderTransferButton =  (beneficiaryAddress, timelockAddress, hasTransfered, amount, txHash, onTransfer) => {
        console.log(`txhash : ${txHash}`)
        console.log(`hasTransfered : ${hasTransfered}`)
        console.log(`amount : ${amount}`)


        // debugger;
        if (timelockAddress){
            if (this.state.pendingTransfers.indexOf(timelockAddress) > -1){
                return <td><Button disabled>Pending...</Button></td>
            }else if( hasTransfered || txHash){
                return <td><Button disabled>Transfered</Button></td>
            }else{
               return <td><Button onClick={(e) => {
                    this.addPendingTransfer(timelockAddress)
                    onTransfer(beneficiaryAddress, timelockAddress, amount, this.removePendingTransfer)
                }}>Transfer</Button></td>
            }
        }else{
            return <td><Button disabled>Transfer</Button></td>
        }
    }
    renderTimelockButton = (timelockAddress, beneficiaryAddress, releaseDate, onTimelock) => {
        if (timelockAddress){
            return <td><Button disabled>Created</Button></td>
        } else if (this.state.pendingTimeLocks.indexOf(beneficiaryAddress) > -1){
            return <td><Button disabled>Pending...</Button></td>
        }else{
            return <td><Button onClick={(e) => {
                    this.addPendingTimelock(beneficiaryAddress)
                    onTimelock(beneficiaryAddress, releaseDate)
                }
            }>Create</Button></td>
        }
    }

    addPendingTimelock = (beneficiaryAddress) => {
        this.setState(prevState => ({
            pendingTimeLocks: [...prevState.pendingTimeLocks, beneficiaryAddress]
        }))
    }

    addPendingTransfer = (timelockAddress) => {
        this.setState(prevState => ({
            pendingTransfers: [...prevState.pendingTransfers, timelockAddress]
        }))
    }


    removePendingTimelock = () => {
        let bCopy = Object.assign({}, this.state.pendingTimeLocks);    //creating copy of object

        Object.keys(this.state.beneficiaries).map((address, index) => {
            var beneficiary = this.state.beneficiaries[address]
            if(beneficiary.timelockAddress && bCopy[beneficiary]){
                delete bCopy[address]
            }
        })
        this.setState({pendingTimeLocks: Object.entries(bCopy)});
    }
    removePendingTransfer = (beneficiaryAddress, timelockAddress, amount) => {
        let bCopy = Object.assign({}, this.state.pendingTransfers);    //creating copy of object

        if(this.state.hasTransfered(beneficiaryAddress, amount, timelockAddress) && bCopy[timelockAddress]){
            delete bCopy[timelockAddress]
        }
        this.setState({pendingTransfers: Object.entries(bCopy)});
    }

    renderReleaseButton = (beneficiaryAddress, amount, timelockAddress, canRelease, onRelease) => {
        if (canRelease && this.state.hasTransfered(beneficiaryAddress, amount, timelockAddress)){
            return <td><Button onClick={(e) => onRelease(timelockAddress)}>Release</Button></td>
        }else{
            return <td><Button disabled>Release</Button></td>
        }
    }

    saveBeneficiariesFile = () => {
        try{
            // var file = new File(JSON.stringify(this.state.beneficiaries), beneficiariesFile, {type: "text/plain;charset=utf-8"});
            var fileString
            var filename = this.state.beneficiariesFile.name.split('.')[0];
            filename = this.state.beneficiariesFile.name.split('_')[0];

            var ext = this.state.beneficiariesFile.name.split('.')[1];
            Object.keys(this.state.beneficiaries).map((beneficiaryAddress, index) => {
                var beneficiary = this.state.beneficiaries[beneficiaryAddress]
                fileString = `${fileString?fileString+'\r\n':''}${beneficiaryAddress},${beneficiary.name},${beneficiary.amount}${beneficiary.timelockAddress?','+beneficiary.timelockAddress:''}${beneficiary.txHash?','+beneficiary.txHash:''}`
            })
            var file = new File([fileString], filename+'_'+moment().format('MMDDYYYYHHmmss')+'.'+ext, {type: "text/plain"})

            FileSaver.saveAs(file);
        }catch(error){
            console.log(error)
        }

    }

}
export default ListTimelocks;