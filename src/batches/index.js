import makeDb from '../db'
import makeBatchList from './batch-list'
import makeBatchesEndpointHandler from './batches-endpoint'

const database = makeDb()
const bacthList = makeBatchList({ database })
const batchesEndpointHandler = makeBatchesEndpointHandler({ bacthList })

export default batchesEndpointHandler
