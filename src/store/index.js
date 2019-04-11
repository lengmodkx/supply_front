import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import task from './modules/task'
import app from './modules/app'
import file from './modules/file'
import tag from './modules/tag'
import project from './modules/project'
import schedule from './modules/schedule'
import member from './modules/member'
import share from './modules/share'
import chat from './modules/chat'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        user,
        task,
        file,
        project,
        member,
        schedule,
        tag,
        share,
        chat
    }
})

export default store