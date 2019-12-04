const helpers = require('../_helpers')

module.exports = {
  isAuth: (req, res, next) => {
    if (!helpers.ensureAuthenticated(req)) return res.redirect('/signin')
    next()
  },

  isAdminAuth: (req, res, next) => {
    // 確認登入狀態
    if (!helpers.ensureAuthenticated(req)) return res.redirect('/signin')
    
    // 確認用戶權限
    if (req.user.role !== 'admin') return res.redirect('/tweets')
    next()
  }
}
