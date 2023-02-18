const moment = require('moment')
const { v4: uuidv4 } = require('uuid');

const FormatMessage = (data,message) => {
  console.log("from formate = > ",data,message);
  return (
    {
        id : uuidv4(),
        name : data.name,
        message : message,
        time : moment().format('h:mm a')
    }
  )
}

module.exports = FormatMessage;