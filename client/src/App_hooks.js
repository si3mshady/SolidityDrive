import React, { useEffect, useState } from "react";
import SolidityDriveContract from "./contracts/SolidityDrive.json";
import {StyledDropZone} from 'react-drop-zone'
import {Table} from 'reactstrap'
import {FileIcon, defaultStyles} from 'react-file-icon'
import "bootstrap/dist/css/bootstrap.css"
import "react-drop-zone/dist/styles.css"
import getWeb3 from "./getWeb3";
// import fileReaderPullStream from 'pull-file-reader'
import React from 'react';
import IPFS from 'ipfs-mini'

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
  
})
// import {post_to_ipfs} from './utils/ipfs'


import "./App.css";

function App()  {


  state = { solidityDrive : [], web3: null, accounts: null, contract: null };

  useEffect(() => {

    async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SolidityDriveContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SolidityDriveContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
  
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance }, this.getFiles);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };


  }, []) 


getFiles = async () => {
  // need to get accounts and  contract

  try { 
  const {account, contract } = this.state;  
  let filesLength = await contract.methods.getLength().call({from: account[0]});
  let files = []
  for (let i = 0; i < filesLength; i++) {
    let file = await contract.methods.getFile(i).call({from: account[0]})
    files.push(file)
  }} catch(err) {
    alert(err)
    console.log(err)
  }

 
}

onDrop = async (file) => {
   try {
    post_to_ipfs(file)
    
  


   } catch(err ) {
      console.log(err)
   }
}

  {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container pt-3">
          <StyledDropZone onDrop={this.onDrop}/>
          <Table>
            <thead>
              <tr>
                <th width="7%" scope="row">Type</th>
                <th className="text-left">File Name</th>
                <th className="text-right">Date</th>
              </tr>             

            </thead>
            <tbody>

              <tr>
                <th><FileIcon size={30} extension="docx" {...defaultStyles}/> </th>
                <th className="text-left">File name.docx</th>
                <th className="text-right">4-11-2021</th>
              </tr>

            </tbody>
          </Table>

        </div>
      </div>
    );
  }
}

export default App;
