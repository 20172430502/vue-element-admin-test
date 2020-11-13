import { login} from '@/api/user'

const getDefaultState = () => {
  return {
    token: window.sessionStorage.getItem('token'),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data , meta } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.username)
        commit('SET_AVATAR', data.id)
        window.sessionStorage.setItem("token",data.token);
        window.sessionStorage.setItem("username",data.username);
        window.sessionStorage.setItem("id",data.id);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      window.sessionStorage.clear(); // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

