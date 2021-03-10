import {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError
} from '../helpers/errors'
import makeHttpError from '../helpers/http-error'
import makeBatch from './batch'

export default function makeBatchesEndpointHandler ({ batchList }) {
  return async function handle (httpRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postBatch(httpRequest)

      case 'GET':
        return getBatches(httpRequest)

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        })
    }
  }

  async function getBatches (httpRequest) {
    const { id } = httpRequest.pathParams || {}
    const { max, before, after } = httpRequest.queryParams || {}

    const result = id
      ? await batchList.findById({ batchId: id })
      : await batchList.getItems({ max, before, after })
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      data: JSON.stringify(result)
    }
  }

  async function postBatch (httpRequest) {
    let batchInfo = httpRequest.body
    if (!batchInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      })
    }

    if (typeof httpRequest.body === 'string') {
      try {
        batchInfo = JSON.parse(batchInfo)
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        })
      }
    }

    try {
      const batch = makeBatch(batchInfo)
      const result = await batchList.add(batch)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      }
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
              ? 400
              : 500
      })
    }
  }
}
