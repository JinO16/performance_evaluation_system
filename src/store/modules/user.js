import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    jobID: '',
    name: '',
    station:'',
    _id: ''
    // avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  // RESET_STATE: (state) => {
  //   Object.assign(state, getDefaultState())
  // },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    sessionStorage.setItem('name',name);
    state.name = name
  },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },

  SET_JOBID: (state, jobID) => {
    sessionStorage.setItem('jobID',jobID);
    state.jobID = jobID
  },
  SET_STATION: (state, station) => {
    sessionStorage.setItem('station',station);
    state.station = station;
  },
  SET_ID: (state, _id) => {
    sessionStorage.setItem('_id',_id);
    state._id = _id;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const t = this;
    const { jobID, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ jobID: jobID.trim(), password: password }).then(response => {
          commit('SET_TOKEN', response.token);
         
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
        console.log('获取用户信息 :>> ', response);
        if (response.code !== 200) {
          reject('验证失败，请重新登录!')
        }
        commit('SET_STATION',response.result.station);
        commit('SET_JOBID', response.result.jobID);
        commit('SET_NAME',response.result.name);
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
        // commit('RESET_STATE')
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
      // commit('RESET_STATE')
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

