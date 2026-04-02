import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <html>
        <head>
          <title>Welcome</title>
        </head>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center;">
            <h1>Welcome to API 🚀</h1>
            <p>Click below to open Swagger Docs</p>
            <a href="/swagger">
              <button style="padding:12px 24px;font-size:16px;cursor:pointer;border-radius:8px;">
                Go to Swagger
              </button>
            </a>
          </div>
        </body>
      </html>
    `;
  }
}