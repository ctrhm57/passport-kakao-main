import dotenv from 'dotenv'
import passport from 'passport'
import express from 'express'
import { Strategy as KakaoStrategy } from '../../dist/passport-kakao'

dotenv.config()
const appKey = process.env.API_KEY
const appSecret = process.env.CLIENT_SECRET_KEY

// 사용자 구현 부분
function save(accessToken: string, refreshToken: string, profile: any) {
  //save 로직 구현
  console.log(`accessToken : ${accessToken}`)
  console.log(`사용자 profile: ${JSON.stringify(profile, null, 2)}`)
}

// passport 에 Kakao Oauth 추가
passport.use(
  new KakaoStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'http://localhost:3000/oauth',
    },
    function (accessToken, refreshToken, params, profile, done) {
      // authorization 에 성공했을때의 액션

      save(accessToken, refreshToken, profile)
      return done(null, profile._json)
    }
  )
)
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// express 앱 설정
const app = express()
app.use(passport.initialize())
app.get('/login', passport.authenticate('kakao', { state: 'myStateValue' }))
app.get('/oauth', passport.authenticate('kakao'), function (req, res) {
  // 로그인 시작시 state 값을 받을 수 있음
  res.send('state :' + req.query.state)
})
console.log('> server start! ')
app.listen(3000)
