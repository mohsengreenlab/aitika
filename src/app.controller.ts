import { Controller, All, Req } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('hello')
  handleHello(@Req() request: Request): string {
    return this.appService.getHello();
  }
}
