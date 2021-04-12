const IPFS = require('ipfs-api');

const ipfs = new IPFS({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
    headers: {
      
      
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods" :"*",
            "Content-Type": "application/x-binary"

            
      }
    
  })


  export default ipfs


