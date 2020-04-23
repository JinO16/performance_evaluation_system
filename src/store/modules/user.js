import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    jobID: '',
    // name: '',
    // avatar: ''
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
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_JOBID: (state, jobID) => {
    state.jobID = jobID
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const t = this;
    const { jobID, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ jobID: jobID.trim(), password: password }).then(response => {
          const id = response.result.jobID;
          commit('SET_TOKEN', response.token);
          commit('SET_JOBID', id)
          setToken(response.token);
          resolve(response);       
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (response.code !== 200) {
          reject('验证失败，请重新登录!')
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(res => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
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

