const { Deluge } = require('@ctrl/deluge')
const discord = require('discord.js')


const format2GB = size => size ? (size/1024/1024/1024).toFixed(2) + 'GB' : 'null'
const format2MB = size => size ? (size/1024/1024).toFixed(2) + 'MB/s' : 'null'

exports.getClient = async ({ DELUGE_HOST, DELUGE_PORT, DELUGE_PASSWORD } = {}) => {
  if (!DELUGE_HOST) {
    return Promise.reject('no server found')
  }
  const baseUrl = `http://${DELUGE_HOST}:${DELUGE_PORT}/`
  return await new Deluge({
    baseUrl,
    password: DELUGE_PASSWORD,
  })
}

exports.getMessageEmbed = (Msg, desc) => {
  const embed = new discord.MessageEmbed()
  embed.setDescription(desc)
  Object.entries(Msg).forEach(([key, value]) => {
    value !== '' && embed.addField(key, value, true)
  })
  return embed
}

exports.formatTorrent = (torrent) => {
  const {
    id,
    name,
    state,
    stateMessage,
    progress,
    ratio,
    dateAdded,
    dateCompleted,
    uploadSpeed,
    downloadSpeed,
    eta,
    totalSelected,
    totalSize,
    totalUploaded,
    totalDownloaded,
  } = torrent
  return {
    Hash: id,
    Name: name,
    State_Message: stateMessage,
    Ratio: ratio.toFixed(2),
    Size: format2GB(totalSelected),
    Total_Size: format2GB(totalSize),
    Up_Speed: format2MB(uploadSpeed),
    Dl_Speed: format2MB(downloadSpeed),
    Uploaded: format2GB(totalUploaded),
    Downloaded: format2GB(totalDownloaded),
    Progress: `${(progress * 100).toFixed(2)}%`,
    State: state,
    Time_ADD: dateAdded ? new Date(dateAdded).toString() : 'null',
    Time_Completed: dateCompleted ? new Date(dateCompleted).toString() : 'null',
    Eta: eta
  }
}

exports.getFilePriority = (fileList, targetSize) => {
  const newFileList = fileList.map((item, id) => Object.assign(item, { id }))
  newFileList.sort((a, b) => b.size - a.size)
  let totalSize = 0
  const dlList = []
  const notDlList = []
  for (const file of newFileList) {
    if ((totalSize + file.size) <= targetSize) {
      dlList.push(file.id)
      totalSize += file.size
    } else {
      notDlList.push(file.id)
    }
  }
  return { dlList, notDlList }
}

exports.sleep = time => new Promise((resolve) => setTimeout(resolve, time))

exports.format2GB = format2GB

exports.format2MB = format2MB
