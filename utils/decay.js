/**
 * Hackernews' hot sort
 * http://amix.dk/blog/post/19574
 */
exports.hackerHot = function (gravity) {
  if (gravity == null) {
    gravity = 1.8;
  }
  return function (votes, itemDate) {
    var hourAge = (Date.now() - itemDate.getTime()) / (1000 * 3600);
    return (votes - 1) / Math.pow(hourAge + 2, gravity);
  };
};
