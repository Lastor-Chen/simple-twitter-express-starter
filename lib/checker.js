const db = require('../models')
const User = db.User

module.exports = {
  checkSignUp: async (input) => {
    const badRequest = Object.values(input).some(val => val === '')
    if (badRequest) return '所有欄位皆為必填'

    if (input.passwordCheck !== input.password) return '兩次密碼不一致，請重新檢查'

    const user = await User.findOne({ where: { email: input.email } })
    if (user) return '信箱已被其他使用者註冊'
  }
}