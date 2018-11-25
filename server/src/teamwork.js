const axios = require('axios')

const company = process.env.TEAMWORK_COMPANY
// const base64 = Buffer.from(`${process.env.TEAMWORK_API_KEY}:xxx`).toString('base64')
const base64 = 'dHdwX3V0OGZJeUQ5ZW9zVkJheVBFZ0NCMXZnTW1TMEM6eHh4'

const http = axios.create({
  baseURL: `https://${company}.teamwork.com`,
  headers: {
    Authorization: `BASIC ${base64}`,
    'Content-Type': 'application/json'
  }
})

function getResponseData(field) {
  return function(res) {
    return field ? res.data[field] : res.data
  }
}

async function project(id) {
  return await http.get(`/projects/${id}.json`).then(getResponseData('project'))
}

async function projects() {
  return await http.get(`/projects.json`).then(getResponseData('projects'))
}

async function createProject(data) {
  return await http
    .post(`/projects.json`, {
      project: data
    })
    .then(getResponseData('id'))
    .then(project)
}

async function updateProject(id, data) {
  return await http
    .put(`/projects/${id}.json`, {
      project: data
    })
    .then(getResponseData('id'))
    .then(project)
}

async function createProjectTaskList(id, data) {
  return await http
    .post(`/projects/${id}/tasklists.json`, {
      'todo-list': data
    })
    .then(getResponseData('TASKLISTID'))
}

async function createTaskListTask(id, data) {
  return await http
    .post(`/tasklists/${id}/tasks.json`, {
      'todo-item': data
    })
    .then(getResponseData('id'))
}

async function createSubTask(id, data) {
  return await http
    .post(`/tasks/${id}.json`, {
      'todo-item': data
    })
    .then(getResponseData('id'))
}

async function updateSubTask(id, data) {
  return await http
    .put(`/tasks/${id}.json`, {
      'todo-item': data
    })
    .then(getResponseData())
}

async function deleteSubTask(id) {
  return await http.delete(`/tasks/${id}.json`).then(getResponseData())
}

async function peoples() {
  return await http.get(`/people.json`).then(getResponseData('people'))
}

async function peopleByEmail(email) {
  const result = await peoples()

  return result.find(function(people) {
    return people['email-address'] === email
  })
}

async function createPeople(data) {
  return await http
    .post('/people.json', {
      person: data
    })
    .then(getResponseData())
}

module.exports = {
  project,
  projects,
  createProject,
  updateProject,
  createSubTask,
  createTaskListTask,
  createProjectTaskList,
  updateSubTask,
  deleteSubTask,
  peoples,
  peopleByEmail,
  createPeople
}
