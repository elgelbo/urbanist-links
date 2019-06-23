var
  mongoose = require('mongoose'),
  List = require('../models/List');

function getCoffee() {
  return new Promise(resolve => {
    setTimeout(() => resolve('☕'), 2000); // it takes 2 seconds to make coffee
  });
}

exports.getStreamIDs = async function() {
  try {
    var handle = 'Matt_Gelbman';
    const user = await List.findOne({user: handle}).then();
    return user.members.toString();
  } catch (e) {
    console.error(e); // 💩
  }
}
