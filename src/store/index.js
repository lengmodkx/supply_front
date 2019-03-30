import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import task from './modules/task'
import app from './modules/app'
import file from './modules/file'
import project from './modules/project'
import schedule from './modules/schedule'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    task,
    file,
    project,
    schedule
  }
})

export default store
