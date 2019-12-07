# Simple Twitter 實作

復刻 Twitter 作業，完成給予的 User stories 需求，及通過自動化測試。

<--這裡會放畫面-->

## ERD
<img src="https://i.gyazo.com/538ed0cf5156a3a887ace8ec6918acce.png" width=400>

## Heroku
- https://burger-simple-twitter.herokuapp.com
- 網站管理員 root@example.com 登入，密碼 12345678
- 一般使用者 user1@example.com 登入，密碼 12345678   
( user1 - user19，共 19 組)

## Initialize
```
# clone 檔案
git clone https://github.com/Lastor-Chen/simple-twitter-express-starter.git

# 進入檔案目錄
cd simple-twitter-express-starter

# 安裝相關套件
npm install

# 建立資料庫
npx sequelize db:migrate
npx sequelize db:migrate --env test

# 建立種子檔案
npx sequelize db:seed:all
npx sequelize db:seed:all --env test

# 啟動服務
npm run dev
```

## Usage
在根目錄下新增 `.env` 檔案，並加入以下內容：

```
IMGUR_CLIENT_ID= < your_client_id >
```
在瀏覽器輸入網址 [localhost:3000](http://localhost:3000) 
即可看到內容。

## 功能測試
在本地測試需修改 config.json 的 `username` 和 `password`
```
  "development": {
    "username": "root",
    "password": "< your_password >",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false,
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": "< your_password >",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging" : false,
    "operatorsAliases": false
  }
```
執行測試
- mac : `$ npm run test`
- win : `$ npm run test:win`

## 基本工具
* MySQL
* Node.js


## Maintainers
© 2019 最終溫蒂蕃茄堡
- TomatoSoup
- Lastor
- Wendy