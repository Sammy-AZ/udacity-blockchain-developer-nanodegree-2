
// import dependencies
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
const Block = require('./Block')
const util = require('./util')
const bodyParser = require('body-parser')
const path = require('path')

const express = require('express')
const app = express()

app.listen(8000, () => console.log('Example app listening on port 8000!'))
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

// Return the doc
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/README.md'))
})

// Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
app.get('/block/:blockHeight', (req, res) => {
  blockchain.getBlock(req.params.blockHeight).then(success => {
    // The block contents must respond to GET request with block contents in JSON format
    res.send(JSON.stringify(success))
  }).catch(error => {
    res.send(res.send(JSON.stringify(error)))
  })
})

app.post('/block', (req, res) => {
  // verify if the request ins't empty
  if (!util.empty(req.body.body)) {

    blockchain.addBlock(new Block(req.body.body)).then(success => {
      // CRITERION: The block contents must respond to POST request with block contents in JSON format
      // Note: addBlock method was modified to return the block created
      res.send(success)
    }).catch(() => {
      // return a message in json format with error
      res.send(JSON.stringify({error: 'There was an error generating a new block'}))
    })

  } else {
    // return parameter error message
    res.send(JSON.stringify({error: 'Parameter error'}))
  }

})
