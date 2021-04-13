import React, { useEffect, useState } from "react";
import SolidityDriveContract from "./contracts/SolidityDrive.json";
import {StyledDropZone} from 'react-drop-zone'
import {Table} from 'reactstrap'
import {FileIcon, defaultStyles} from 'react-file-icon'
import "bootstrap/dist/css/bootstrap.css"
import "react-drop-zone/dist/styles.css"
import getWeb3 from "./getWeb3";
import Moment from 'moment'
import fileReaderPullStream from 'pull-file-reader'
import IPFS from 'ipfs-mini'
import "./App.css";
// import ipfs from './utils/ipfs.js'
import axios from 'axios'

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
  
})


export default function App() {


  const [fileList, setFileList] = useState([])
  const [acct, getAccts] = useState([])
  const [properties, setProperties ] = useState({ 
    solidityDrive : [],
    web3: null,
    accounts: [],
    contract: null,
    hash: '',
    name: '',
    type: '',
    timestamp: null,
    result: null,
    url: null
  })


 

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
    setProperties(prev => ({ ...prev, web3:web3, accounts:accounts, contract: instance }));



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
}, [fileList])

useEffect(() => {
    

})


const  getFiles = async () => {
    // need to get accounts and  contract
  
    try { 
      
    const {accounts, contract } = properties;  
    console.log(properties)
    let filesLength = await contract.methods.getLength().call({from: accounts[0]});
    let files = []
    for (let i = 0; i < filesLength; i++) {
      //calling the 'getFile' method on the actual smart contract 
      let file = await contract.methods.getFile(i).call({from: accounts[0]})
      // pushing 
      files.push(file)
      console.log(file)
      console.log(files)
      setFileList(prev => [file , ...prev])
    }
  
  } catch(err) {
      alert(err)
      console.log(err)
    }
  
   
  }
  


  const onDrop = async (data) => {
    try {

      console.log(properties)     
     
    var file = data

       var reader = new FileReader();
       reader.onloadend = async function() {
       // creates a stream of bytes to write data to memory 
        const buff =  Buffer.from(reader.result.replace(/^data:image\/\w+;base64,/, ""),'base64')

         const result = await ipfs.add(buff, async (err,_hash) => {
           if (!err) {
            
                      
              const fileType = data.name.substr(data.name.lastIndexOf('.')+1)                   
              const ts = Math.round(+new Date()/ 1000)  
              const url = 'https://ipfs.infura.io/ipfs/' + _hash 
              setProperties(prev => ({...prev, name: data.name, hash: _hash,  type: fileType, timestamp:ts, url:url }))
              let {accounts, contract } = properties              
              let uploaded  = await contract.methods.add(_hash, data.name,fileType, ts).send({from: accounts[0], gas: 300000 })
              
              getFiles()
 
  
              
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

           
            {

              fileList.map((prop, index) => (
                <tr>
                    <th><FileIcon key={prop.timestamp} size={30} extension={prop[2]} {...defaultStyles[2]}/> </th>
                    <th className="text-left" key={prop.timestamp}><a href={'https://ipfs.io/ipfs/' + prop[0]}>{prop[1]}</a></th>
                    <th className="text-right" key={prop.timestamp}>
                    
                    {/* <Moment format="YYYY/MM/DD" unix> {prop[3]}   </Moment> */}
                             
                    </th>
                </tr>
              ))
            }
              
            
           

          </tbody>
        </Table>

      </div>
    </div>
  );
}

// https://discuss.ipfs.io/t/add-api-file-argument-path-is-required/2404

// curl -F "file=@./dog.txt" "http://localhost:5001/api/v0/add"
