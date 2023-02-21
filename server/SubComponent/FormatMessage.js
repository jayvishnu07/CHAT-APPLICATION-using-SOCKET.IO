const moment = require('moment')

function FormatWelcomeMessage(data,message){
  return (
    {
        name : data.name,
        roomId : data.roomId,
        message : message,
        type : "notification",
        time : moment().format('h:mm a')
    }
  )
}

function FormatExitMessage (data,message){
  return (
    {
        name : data.name,
        roomId : data.roomId,
        message : message,
        type : "notification",
        time : moment().format('h:mm a')
    }
  )
}

function FormatNotificationMessage(data,message){
  return (
    {
        name : data.name,
        roomId : data.roomId,
        message : message,
        type : "notification",
        time : moment().format('h:mm a')
    }
  )
}

module.exports = {FormatWelcomeMessage, FormatExitMessage,FormatNotificationMessage }