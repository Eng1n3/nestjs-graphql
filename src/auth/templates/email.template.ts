import '../../common/config/config.env';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const emailTemplate = (token) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap" rel="stylesheet">
    <title>Lupa password</title>
    <style>
      body {
        position: relative;
        width: 600px;
        height: 640px;
        font-family: 'Poppins', "";
        background: #ffffff;
        border-radius: 24px;
      }
      .wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: red;
        width: 100vw;
      }
      .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
      }
      .lp-img {
        display: block;
        width: 200px;
        height: 200px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;

        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 0;
      }
      .lp-title {
        align-items: center;

        width: 228px;
        height: 76px;
        margin-left: auto;
        margin-right: auto;

        font-family: "Poppins";
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 160%;

        /* or 38px */
        text-align: center;

        /* Dark/Dark 4 */
        color: #373a40;

        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 0;
      }
      .lp-text {
        width: 552px;
        height: 44px;

        font-family: "Poppins";
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 160%;

        /* or 22px */
        text-align: center;

        /* Dark/Dark 4 */
        color: #373a40;

        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 0;
        margin-left: auto;
        margin-right: auto;
      }
      .lp-btn {
        /* *Button Unstyled* */
        cursor: pointer;

        /* Auto layout */
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1px 18px;
        gap: 10px;

        width: 430px;
        height: 36px;

        /* dark/6 */
        background: #25262b;
        border-radius: 8px;

        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 1;

        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 34px;

        /* identical to box height, or 243% */

        /* other/white */
        color: #ffffff;

        /* Inside auto layout */
        flex: none;
        order: 1;
        flex-grow: 0;
        margin-left: auto;
        margin-right: auto;
      }
    </style>
  </head>
  <body>
      <div class="wrapper">
          <div class="container" style="width: 100%">              
              <img
                src="http://localhost:19007/uploads/forgot-email.png"
                alt="forgot email"
                class="lp-img"
              />
            <div class="lp-title">Lupa kata sandi akun WebGIS RTGL</div>
            <div class="lp-text">
              Permintaan telah diterima untuk atur ulang password untuk akun Anda. Ubah
              password Anda dengan cara klik tombol dibawah ini:
            </div>
            <a class="lp-btn" href="${configService.get<string>(
              'FRONTEND_DOMAIN',
            )}${configService.get<string>(
  'FORGOT_PASSWORD_PATH',
)}?tokenForgot=${token}">Atur ulang kata sandi</a>
        </div>
        <a class="lp-btn" href="${configService.get<string>(
          'FRONTEND_DOMAIN',
        )}${configService.get<string>(
  'FORGOT_PASSWORD_PATH',
)}">Atur ulang kata sandi</a>
    </div>
  </body>
</html>
`;
