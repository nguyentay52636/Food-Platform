import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    res.send(`
      <html>
        <head>
          <title>Home</title>
        </head>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
          <a href="/swagger">
            <button style="padding:10px 20px;font-size:18px;cursor:pointer;">
              Go to Swagger 🚀
            </button>
          </a>
        </body>
      </html>
    `);
  }
}