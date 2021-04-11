import React, { useEffect, useState } from "react";
import SolidityDriveContract from "./contracts/SolidityDrive.json";
import {StyledDropZone} from 'react-drop-zone'
import {Table} from 'reactstrap'
import {FileIcon, defaultStyles} from 'react-file-icon'
import "bootstrap/dist/css/bootstrap.css"
import "react-drop-zone/dist/styles.css"
import getWeb3 from "./getWeb3";
// import fileReaderPullStream from 'pull-file-reader'
import IPFS from 'ipfs-mini'
import "./App.css";


const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
  
})


export default function App() {

useEffect(  () => {

async function init () {
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
    setProperties(prev => ({ ...prev, web3:web3, accounts:accounts, instance: instance }));
    return true;
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }




}

init()





})


  const [properties, setProperties ] = useState({ 
    solidityDrive : [],
    web3: null,
    accounts: [],
    contract: null,
    hash: null,
    name: null,
    type: null,
    timestamp: null,
    result: null,
    url: null
  })


const  getFiles = async () => {
    // need to get accounts and  contract
  
    try { 
    const {accounts, contract } = properties;  
    console.log(accounts)
    let filesLength = await contract.methods.getLength().call({from: this.state.accounts[0]});
    let files = []
    for (let i = 0; i < filesLength; i++) {
      let file = await contract.methods.getFile(i).call({from: accounts[0]})
      files.push(file)
      console.log(file)
    }} catch(err) {
      alert(err)
      console.log(err)
    }
  
   
  }
  


 const onDrop = async (data) => {
    try {
      
     
       var file = data
           
       var reader = new FileReader();
       reader.onloadend = async function() {
         console.log('RESULT', reader.result)    
         const buff =  Buffer.from(reader.result.replace(/^data:image\/\w+;base64,/, ""),'base64')
         let result = await ipfs.add(buff, async (err,_hash) => {
           if (!err) {
                      
               const fileType = data.name.substr(data.name.lastIndexOf('.')+1)              
               const ts = Math.round(+new Date()/ 1000)  
               const url = 'https://ipfs.infura.io/ipfs/' + _hash 
               setProperties(prev => ({...prev, name: data.name, result: result, type: fileType, timestamp:ts, url:url }))
               
               let {result, accounts, hash, name, type, timestamp, contract } = properties
               let uploaded  = await contract.methods.add(hash, name,fileType, timestamp).send({from: accounts[0], gas: 888 })
  
               // let uploaded  = await this.state.contract.methods.add(this.result[0].hash, data.name,this.state.type, this.state.timestamp).send({from: this.accounts[0], gas: 300000 })
  
                        
  
              
           }
   
         })
          
      }
       reader.readAsDataURL(file);
  
    } catch(err ) {
       console.log(err)
    }
  
  }
  
    

  return  (
    <div className="App">
      <div className="container pt-3">
        <StyledDropZone onDrop={onDrop}/>
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

