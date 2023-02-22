const moment = require('moment')

function FormatWelcomeMessage(data, socketId, message) {
  return (
    {
      name: data.name,
      roomId: data.roomId,
      socketId: socketId,
      message: message,
      type: "notification",
      time: moment().format('h:mm a')
    }
  )
}


function FormatNotificationMessage(data, socketId, message) {
  return (
    {
      name: data.name,
      roomId: data.roomId,
      socketId: socketId,
      message: message,
      type: "notification",
      time: moment().format('h:mm a')
    }
  )
}
function FormatExitMessage(data, message) {
  return (
    {
      name: data.name,
      roomId: data.roomId,
      socketId: data.id,
      message: message,
      type: "notification",
      time: moment().format('h:mm a')
    }
  )
}

module.exports = { FormatWelcomeMessage, FormatExitMessage, FormatNotificationMessage }