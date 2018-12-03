import React, { Component } from 'react'

import RichTextEditor from 'react-rte'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'

class ProjectPlan extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: RichTextEditor.createEmptyValue(),
      readOnly: true
    }

    this.onChange = this.onChange.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount() {
    this.setState({
      value: this.state.value.setContentFromString(
        this.props.project.plan || '',
        'html'
      )
    })
  }

  onChange(value) {
    this.setState({
      value
    })
  }

  handleEdit() {
    this.setState({
      readOnly: false
    })
  }

  async handleSave() {
    try {
      await this.props.mutate({
        variables: {
          id: this.props.project.id,
          plan: this.state.value.toString('html')
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(
        `Projeto (${this.props.project.name}) atualizado com sucesso`
      )

      this.setState({
        readOnly: true
      })
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }
  }

  render() {
    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          {this.state.readOnly && (
            <Button type="primary" onClick={this.handleEdit}>
              <Icon type="edit" />
              <span>Editar</span>
            </Button>
          )}

          {!this.state.readOnly && (
            <Button type="primary" onClick={this.handleSave}>
              <Icon type="check" />
              <span>Salvar</span>
            </Button>
          )}
        </div>

        <RichTextEditor
          className="rich-text-editor"
          value={this.state.value}
          readOnly={this.state.readOnly}
          placeholder="Informe o plano de projeto"
          onChange={this.onChange}
          toolbarConfig={{
            display: [
              'INLINE_STYLE_BUTTONS',
              'BLOCK_TYPE_BUTTONS',
              'LINK_BUTTONS',
              'BLOCK_TYPE_DROPDOWN',
              'HISTORY_BUTTONS'
            ],
            INLINE_STYLE_BUTTONS: [
              { label: 'Negrito', style: 'BOLD' },
              { label: 'Itálico', style: 'ITALIC' },
              { label: 'Tachado', style: 'STRIKETHROUGH' },
              { label: 'Código', style: 'CODE' },
              { label: 'Sublinhado', style: 'UNDERLINE' }
            ],
            BLOCK_TYPE_DROPDOWN: [
              { label: 'Normal', style: 'unstyled' },
              { label: 'Título Grande', style: 'header-one' },
              { label: 'Título Médio', style: 'header-two' },
              { label: 'Título Pequeno', style: 'header-three' },
              { label: 'Bloco de Código', style: 'code-block' }
            ],
            BLOCK_TYPE_BUTTONS: [
              { label: 'UL', style: 'unordered-list-item' },
              { label: 'OL', style: 'ordered-list-item' }
            ]
          }}
        />
      </div>
    )
  }
}

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $plan: String!) {
    updateProject(where: { id: $id }, data: { plan: $plan }) {
      id
    }
  }
`

const withGraphql = graphql(UPDATE_PROJECT)

export default withGraphql(ProjectPlan)
