import React from 'react'

import Input from 'antd/lib/input'
import TextArea from 'antd/lib/input/TextArea'
import InputNumber from 'antd/lib/input-number'
import FormItem from 'antd/lib/form/FormItem'

function FormInput({ input, meta, label, type = 'text', ...rest }) {
  return (
    <FormItem
      label={label}
      hasFeedback={true}
      validateStatus={meta.touched && meta.invalid ? 'error' : ''}
      help={meta.touched && meta.invalid ? meta.error : ''}
    >
      {type === 'textarea' ? (
        <TextArea {...rest} {...input} />
      ) : type === 'number' ? (
        <InputNumber {...rest} {...input} />
      ) : (
        <Input type={type} {...rest} {...input} />
      )}
    </FormItem>
  )
}

export default FormInput
