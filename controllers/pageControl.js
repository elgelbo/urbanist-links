exports.home = (req, res) => {
  res.render('index', {"cat": "hat"});
}