const moment = require('moment')

const FormatMessage = (data,message) => {
  return (
    {
        name : data.name,
        message : message,
        type : "notification",
        time : moment().format('h:mm a')
    }
  )
}

module.exports = FormatMessage;