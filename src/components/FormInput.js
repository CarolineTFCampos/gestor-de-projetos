import React from 'react'

import moment from 'moment'

import Input from 'antd/lib/input'
import TextArea from 'antd/lib/input/TextArea'
import FormItem from 'antd/lib/form/FormItem'
import DatePicker from 'antd/lib/date-picker'
import InputNumber from 'antd/lib/input-number'

function FormInput({
  input: { value, ...input },
  meta,
  label,
  type = 'text',
  prefix = '',
  suffix = '',
  ...rest
}) {
  return (
    <FormItem
      label={label}
      hasFeedback={true}
      validateStatus={meta.touched && meta.invalid ? 'error' : ''}
      help={meta.touched && meta.invalid ? meta.error : ''}
    >
      {type === 'textarea' ? (
        <TextArea {...rest} {...input} value={value} />
      ) : type === 'number' ? (
        <InputNumber {...rest} {...input} value={value} />
      ) : type === 'datepicker' ? (
        <DatePicker
          {...rest}
          {...input}
          value={value && moment(value)}
          format="DD/MM/YYYY"
        />
      ) : (
        <Input
          type={type}
          {...rest}
          {...input}
          value={value}
          prefix={prefix}
          suffix={suffix}
        />
      )}
    </FormItem>
  )
}

export default FormInput
