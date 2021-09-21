export default axios => ({
  get: (payload = {}) => axios.get(`data/2.5/weather`, payload)
})
