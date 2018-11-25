import React from 'react'

import moment from 'moment'

import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import FormItem from 'antd/lib/form/FormItem'
import DatePicker from 'antd/lib/date-picker'
import TextArea from 'antd/lib/input/TextArea'
import InputNumber from 'antd/lib/input-number'

function FormInput({
  input: { value, onChange, ...input },
  meta,
  label,
  type = 'text',
  prefix = '',
  suffix = '',
  style = {},
  children,
  ...rest
}) {
  style.width = style.width || '100%'

  return (
    <FormItem
      label={label}
      hasFeedback={true}
      validateStatus={meta.touched && meta.invalid ? 'error' : ''}
      help={meta.touched && meta.invalid ? meta.error : ''}
    >
      {type === 'textarea' ? (
        <TextArea
          {...rest}
          {...input}
          onChange={onChange}
          style={style}
          value={value}
        />
      ) : type === 'number' ? (
        <InputNumber
          {...rest}
          {...input}
          onChange={onChange}
          style={style}
          value={value}
        />
      ) : type === 'datepicker' ? (
        <DatePicker
          {...rest}
          {...input}
          onChange={onChange}
          style={style}
          format="DD/MM/YYYY"
          value={value && moment(value)}
        />
      ) : type === 'select' ? (
        <Select
          {...rest}
          {...input}
          onChange={onChange}
          style={style}
          value={value}
        >
          {children}
        </Select>
      ) : type === 'radiobutton' ? (
        <Radio.Group
          {...rest}
          {...input}
          onChange={event => onChange(event.target.value)}
          style={style}
          value={value}
          buttonStyle="solid"
        >
          {children}
        </Radio.Group>
      ) : (
        <Input
          {...rest}
          {...input}
          onChange={onChange}
          type={type}
          style={style}
          value={value}
          prefix={prefix}
          suffix={suffix}
        />
      )}
    </FormItem>
  )
}

export default FormInput
