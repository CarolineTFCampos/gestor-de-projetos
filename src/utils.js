import moment from 'moment'

const money = new Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL'
})

export const roleLevelTypesTranslate = {
  TRAINEE: 'Trainee',
  JUNIOR: 'Junior',
  INTERMEDIATE: 'Pleno',
  SENIOR: 'Sênior',
  EXPERT: 'Especialista'
}

export const epicStatusTranslate = {
  TODO: 'A fazer',
  INPROGRESS: 'Em progresso',
  DONE: 'Concluído'
}

export const releaseStatusTranslate = {
  OPEN: 'Aberta',
  DONE: 'Concluída'
}

export const milestoneStatusTranslate = {
  OPEN: 'Aberto',
  DONE: 'Concluído',
  CANCELED: 'Cancelado'
}

export function formatDate(value) {
  return moment(value).format('DD/MM/YYYY')
}

export function formatMoney(value) {
  return money.format(value)
}

export function formatMinutesToHour(value) {
  return (
    parseFloat(
      value
        ? moment
            .duration(value, 'minutes')
            .asHours()
            .toFixed(2)
        : '0'
    ) + 'hrs'
  )
}

export function formatFloatToMoney(value) {
  return `R$ ${
    value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
  }`
}

export function parserMoneyToFloat(value) {
  return value.replace('R', '').replace(/\$\s?|(,*)/g, '')
}
