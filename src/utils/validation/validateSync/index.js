import { ifElse } from 'ramda'
import { returnsExpected, reduceResultsWhile } from '../reduceWhile'
import getFieldRules from '../getFieldRules'
import createValidatorResult from '../createValidatorResult'
import createValidationResult from '../createValidationResult'
import shouldValidateSync from './shouldValidateSync'
import ensureValue from './ensureValue'
import applyFieldRule from './applyFieldRule'
import applyFormRules from './applyFormRules'

export default function validateSync(resolverArgs, force) {
  console.group('validateSync', resolverArgs.fieldProps.displayFieldPath)

  const { fieldProps, form } = resolverArgs
  const { rxRules } = form.state
  const relevantRules = getFieldRules(fieldProps, rxRules)

  console.log('running validators sequence...')

  const result = ifElse(
    shouldValidateSync,
    reduceResultsWhile(returnsExpected, [
      ensureValue,
      applyFieldRule,
      applyFormRules,
    ]),

    // When no validation is needed
    () => {
      return createValidationResult(true)
    },
  )(resolverArgs, relevantRules, force)

  console.warn('validateSync result:', result)
  console.groupEnd()

  return createValidatorResult('sync', result)
}
