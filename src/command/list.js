const client = require('../../client')

module.exports = async ([serverName]) => {
  const deluge = await client(serverName)
  const data = await deluge.getAllData()
  return data.torrents
}
