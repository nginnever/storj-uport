'use strict'
/* global Web3 globalState render */
const Registry = require('uport-persona');
// Setup
//const ipfs = window.IpfsApi('localhost', '5001')
const Uport = window.uportlib.Uport
const appName = 'Storj'

var options = {
  rpcUrl: 'http://localhost:8545',
  //infuraApiKey: 'RtARjTrrIIY89tI1E2T3',
  ipfsProvider: {
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
    root: ''
  }
}
const uport = new Uport(appName, options)
const Web3 = window.Web3
//const web3 = uport.getWeb3()
const web3 = new Web3()
var uportProvider = uport.getUportProvider()
web3.setProvider(uportProvider)
console.log(Registry)

const registry = new Registry.Registry({
  ipfs: { host: '127.0.0.1', port: 5001, protocol: 'http'},
  web3prov: web3.currentProvider
})


var storjContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_islog","type":"address"}],"name":"logIn","type":"event"}]);
var storj = storjContract.at('0xdb8e890e7bf693830c8ddc0e00b42e25be576a5f')

// uPort connect

window.uportConnect = () => {
  web3.eth.getCoinbase((error, address) => {
    console.log(error)
    if (error) { throw error }
    globalState.uportId = address
    // uport.registry.uportRegistry.registryContract.getAttributes(globalState.uportId).then(function (attributes){
    //   console.log(attributes)
    //   //console.log(bs58.encode(new Buffer(attributes, 'hex')))
    // })
    //const registry = new uport.registry()
    uport.getUserPersona(address).then((persona)=> {
      console.log('Test')
      console.log(persona)
      const profile = persona.profile
      console.log(profile)
      globalState.uportName = profile.name
      globalState.imageSrc = 'https://ipfs.io/' + profile.image.contentUrl
      render()
    }).catch((e) => {console.log(e)})
  })
}

window.storjRegister = () => {
  web3.eth.getCoinbase((error, address) => {
    console.log(error)

    if (error) { throw error }
    globalState.uportId = address
    // registry.getPersona(address).then(function (persona){
    //   console.log(persona)
    //   var claim = persona.issuer(address)
    //   console.log(claim.type('email')[0])
    // })
    //uport.registry.uportRegistry.registryContract.getAttributes(globalState.uportId).then(function (attributes){
        //console.log(bs58.encode(new Buffer(attributes, 'hex')))
        storj.register({from:address, gas:300000}, (err, res) => {
          window.createUserUport(address, (res) => {
            console.log(res)
          })
          console.log(res)
        })
      
    //})
  })
}

window.storjLogin = () => {
  web3.eth.getCoinbase((error, address) => {
    console.log(error)
    if (error) { throw error }
    globalState.uportId = address

    // var exampleEvent = storj.logIn({from: address});
    // exampleEvent.watch(function(err, result) {
    //   if (err) {
    //     console.log(err)
    //     return;
    //   }
    //   console.log(result)
    //   console.log(result.args._islog)
    //   console.log(result.address)
    //   // check that result.args._from is web3.eth.coinbase then
    //   // display result.args._value in the UI and call    
    //   // exampleEvent.stopWatching()
    // })

    storj.login.sendTransaction({from:address}, (err, txhash) => {
      window.authUport((res) => {
        console.log('Bridge server responded with authorized data')
        console.log(res)
      })
      console.log(err)
      console.log(txhash)
    })
  })
}

window.newBucket = () => {
  const someUser = new bucketsRouter.storage.models.User({
    _id: 'ginneversource@gmail.com',
    hashpass: 'bushido420'
  });
  window.createBucket(someUser, (res) => {
    console.log(res)
  })
}

// Send ether
window.sendEther = () => {
  const value = parseFloat(globalState.sendToVal) * 1.0e18
  const gasPrice = 100000000000
  const gas = 500000

  web3.eth.sendTransaction(
    {
      from: globalState.uportId,
      to: globalState.sendToAddr,
      value: value,
      gasPrice: gasPrice,
      gas: gas
    },
    (error, txHash) => {
      if (error) { throw error }
      globalState.txHash = txHash
      render()
    }
  )
}
