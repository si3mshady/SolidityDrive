import React from 'react';
import IPFS from 'ipfs-mini'

const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
    
  })
  
export const post_to_ipfs = (data) => {    

    
    var file = data
        
    var reader = new FileReader();
    reader.onloadend = function() {
      console.log('RESULT', reader.result)    
      const buff =  Buffer.from(reader.result.replace(/^data:image\/\w+;base64,/, ""),'base64')
      ipfs.add(buff, (err,hash) => {
        if (!err) {
            // console.log(hash)

            const url = 'https://ipfs.infura.io/ipfs/' + hash 
            console.log(url)
        }

      })
       
   }
    reader.readAsDataURL(file);
      
  
  }
     


