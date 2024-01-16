const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');
const cookieParser = require('cookie-parser');




// bodyParser 미들웨어를 사용하여 POST 요청의 바디를 파싱
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());






// 헤더의 로그인 정보 표시 부분
app.get('/index', function (req, res) {
    console.log('/index call')
    res.json({
        'name': '신주원',
        'email': 'sjw9179@stud.net',
        'ProfileImg_URL': 'https://cdn-icons-png.flaticon.com/512/6967/6967627.png'
    });
});




// 특정 도메인에서의 요청 허용
const allowedOrigins = ['http://127.0.0.1:5500'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));


app.post('/Login', (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.email && password === process.env.pass) {
        // 랜덤 문자열 생성 (예: 32바이트)
        const randomString = crypto.randomBytes(32).toString('hex');

        // 로그인 성공 시 JWT 토큰 생성
        const expiresIn = req.body.expiresIn || 30 * 24 * 60 * 60; // 기본적으로 1달 (초 단위)

        const token = jwt.sign({ email, randomString }, process.env.StudSecretTokenKey, { expiresIn });

        // 토큰을 JSON 응답에 함께 보냅니다.
        res.json({
            success: true,
            message: '로그인 성공!',
            token: token, // 토큰을 응답에 추가
        });

        console.log('Login 성공');
    } else {
        res.json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않아요!' });
        console.log('Login 실패');
    }
});



app.post('/CheckLogin', (req, res) => {
    // 클라이언트에서 쿠키로 전달된 토큰 가져오기
    const token = req.authToken;

    // 토큰이 존재하지 않으면 로그인이 되어 있지 않은 상태로 간주
    if (!token) {
        console.log('No token');
        return res.json({ success: false, message: '토큰이 없습니다.' });
    }

    // 토큰 확인
    jwt.verify(token, process.env.StudSecretTokenKey, (err, decoded) => {
        if (err) {
            // 토큰이 유효하지 않으면 로그인이 되어 있지 않은 상태로 간주
            console.log('No mm token');
            return res.json({ success: false, message: '토큰이 유효하지 않습니다.' });
        }

        // 토큰이 유효하면 사용자 정보 전송
        console.log('CheckLogin ok');
        res.json({
            success: true,
            message: '사용자 인증 성공',
            user: decoded,
        });
    });
});





// Arcade 부분


//Figlet

var figlet = require("figlet");

figlet("Hello World!!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});




















app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
