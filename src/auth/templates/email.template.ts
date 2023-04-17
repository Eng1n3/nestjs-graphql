import { ConfigService } from '@nestjs/config';
import '../common/config/config.env';

const configService = new ConfigService();

export const emailTemplate = (token: string) => `
<html>
  <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap" rel="stylesheet">
      <style>
      body {
        position: relative;
        width: 600px;
        height: 640px;
        font-family: "Poppins", sans-serif;
        background: #ffffff;
        border-radius: 24px;
      }
      .container {
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
      }
      .lp-img {
        display: block;
        width: 200px;
        height: 200px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 40px;
      }
      .lp-title {
        width: 228px;
        height: 76px;
        margin-left: auto;
        margin-right: auto;
        font-family: "Poppins", sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        text-align: center;
        color: #373a40;
        margin-bottom: 10px;
      }
      .lp-text {
        width: 552px;
        height: 44px;
        font-family: "Poppins", sans-serif;
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 160%;
        text-align: center;
        color: #373a40;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 30px;
      }
      .lp-btn {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1px 18px;
        width: 430px;
        height: 36px;
        background: #25262b;
        border-radius: 8px;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 34px;
        text-decoration: none;
        margin-left: auto;
        margin-right: auto;
        display: inline-block;
      }
      a.lp-btn {
        color: white;
      }
    </style>
  <head/>
  <body>
    <div class="container">
      <img
      src="${configService.get<string>('DOMAIN')}/uploads/forgot-email.png"
      alt="forgot email"
      class="lp-img"
      />
      <div class="lp-title">Lupa kata sandi akun WebGIS RTGL</div>
      <div class="lp-text">
        Permintaan telah diterima untuk atur ulang password untuk akun Anda.
        Ubah password Anda dengan cara klik tombol dibawah ini:
      </div>
      <div class="btn-link" style="text-align: center;">
        <a class="lp-btn" href="${configService.get<string>(
          'FRONTEND_DOMAIN',
        )}${configService.get<string>(
  'FORGOT_PASSWORD_PATH',
)}?tokenForgot=${token}">
          Atur ulang kata sandi
        </a>
      </div>
    </div>
  </body>
</html>
`;
