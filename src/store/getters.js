const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  name: state => state.user.name,
  jobID: state => state.user.jobID,
  station: state => state.user.station,
  _id : state => state.user._id
}
export default getters
