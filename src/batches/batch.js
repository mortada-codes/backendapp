import requiredParam from '../helpers/required-param'
import { InvalidPropertyError } from '../helpers/errors'


export default function makeBatch (
  batchInfo = requiredParam('batchInfo')
) {
  const validBatch = validate(batchInfo)
  const normalBatch = normalize(validBatch)
  return Object.freeze(normalBatch)

  function validate ({
    color = requiredParam('color'),
    size = requiredParam('size'),
    quantity = requiredParam('quantity'),
    ...otherInfo
  } = {}) {
    validateColor('color', color)
    validateSize( size)
    validateQuantity(quantity)
    return { firstName, lastName, emailAddress, ...otherInfo }
  }

  function validateSize ( size) {
    if (!['S' , 'M' , 'L' , 'XL'].includes(size)) {
      throw new InvalidPropertyError(
        `A size's must be in ['S' , 'M' , 'L' , 'XL'].`
      )
    }
  }

  function validateColor (color) {
    if ( !['red' , 'blue' , 'black' ,'green'].includes(color)) {
      throw new InvalidPropertyError(
        `A color must in ['red' , 'blue' , 'black' ,'green'].`
      )
    }
  }

  function validateQuantity (quantity) {
    if (parseInt(quantity) <= 0) {
      throw new InvalidPropertyError('Invalid quantity.must be bigger than Zero.')
    }
  }

  function normalize ({  size, color, quantity, ...otherInfo }) {
    return {
      ...otherInfo,
      size: size,
      color: color,
      quantity: quantity
    }
  }
}
