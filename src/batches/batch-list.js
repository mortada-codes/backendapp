import makeBatch from './batch'
import { UniqueConstraintError } from '../helpers/errors'


export default function makeBatchList ({ database }) {
  return Object.freeze({
    add,
    findById,
    getItems,
  })

  async function getItems ({ max = 100, before, after } = {}) {
    const db = await database
    const query = {}
    if (before || after) {
      query._id = {}
      query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
      query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
    }

    return (await db
      .collection('batches')
      .find(query)
      .limit(Number(max))
      .toArray()).map(documentToBatch)
  }

  async function add ({ batchId, ...batch }) {
    const db = await database
    if (batchId) {
      batch._id = db.makeId(batchId)
    }
    const { result, ops } = await db
      .collection('batches')
      .insertOne(batch)
      .catch(mongoError => {
        const [errorCode] = mongoError.message.split(' ')
        throw mongoError
      })
    return {
      success: result.ok === 1,
      created: documentToBatch(ops[0])
    }
  }

  async function findById ({ batchId }) {
    const db = await database
    const found = await db
      .collection('batches')
      .findOne({ _id: db.makeId(batchId) })
    if (found) {
      return documentToBatch(found)
    }
    return null
  }

  function documentToBatch ({ _id: batchId, ...doc }) {
    return makeBatch({ batchId, ...doc })
  }
}
