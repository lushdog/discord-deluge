const serverConfig = require('./config.json')
const { getClient } = require('./src/utils')
const Clients = {}

const delugeClinet = async (serverName) => {
  if (Clients[serverName]) {
    return Clients[serverName]
  } else { 
    const clientInstace = await getClient(serverConfig[serverName])
    Clients[serverName] = clientInstace
    return clientInstace
  }
}

module.exports = (serverName) => {
  return delugeClinet(serverName)
}
