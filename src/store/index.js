import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import task from './modules/task'
import app from './modules/app'
import file from './modules/file'
import materialfile from './modules/materialfile'
import tag from './modules/tag'
import project from './modules/project'
import schedule from './modules/schedule'
import member from './modules/member'
import share from './modules/share'
import chat from './modules/chat'
import news from './modules/news'
import company from './modules/company'
import relation from './modules/relation'
import tree from './modules/tree'
//import gantt from './modules/gantt'

import Login from "./webim/login";
import Chats from "./webim/chats";
import Group from "./webim/group";
import Emedia from "./webim/emedia";
import FriendModule from "./webim/friendModule";

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
        chat,
        news,
        company,
        relation,
        tree,
        materialfile,
        login: Login,
		chats: Chats,
		group: Group,
        emedia: Emedia,
        friendModule: FriendModule,
       // gantt
    }
})

export default store