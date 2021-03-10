import express from 'express'
import bodyParser from 'body-parser'
import handleBatchesRequest from './batches'
import adaptRequest from './helpers/adapt-request'

const app = express()
app.use(bodyParser.json())

app.all('/batches', batchesController)
app.get('/batches/:id', batchesController)

function batchesController (req, res) {
  const httpRequest = adaptRequest(req)
  handleBatchesRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res
        .set(headers)
        .status(statusCode)
        .send(data)
    )
    .catch(e => res.status(500).end())
}

app.listen(9090, () => console.log(`Listening on port 9090`))
