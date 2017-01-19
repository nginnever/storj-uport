/* global Web3 globalState render */

// Setup

const Uport = window.uportlib.Uport
const appName = 'Storj'
const uport = new Uport(appName)
const web3 = uport.getWeb3()

storjContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"}]);
var storj = storjContract.at('0x61ae21d286323a60801190c280647e502c53900d')

// uPort connect

const uportConnect = () => {
  web3.eth.getCoinbase((error, address) => {
    console.log(error)
    if (error) { throw error }
    globalState.uportId = address
    storj.register({from:address, gas:300000}, (err, res) => {
      console.log(res)
    })
    // uport.getUserPersona(address).then((persona)=> {
    //   console.log('Test')
    //   console.log(persona)
    //   const profile = persona.profile
    //   console.log(profile)
    //   globalState.uportName = profile.name
    //   globalState.imageSrc = 'https://ipfs.io/' + profile.image.contentUrl
    //   render()
    // }).catch((e) => {console.log(e)})
  })
}


// Send ether
const sendEther = () => {
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
