import { BadRequestException, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { jsonFileFilter } from './file-helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async asyncgetHello(): Promise<string> {
    return "this.appService.mustacheLaTex( inputFields);"
  }


  @Post('informe')
  @UseInterceptors(FileInterceptor('inputFields',{ fileFilter: jsonFileFilter, }),)
  async createReport(@UploadedFile() inputFields: any, @Req() req: any) {
      if (!inputFields || req.fileValidationError) {
          throw new BadRequestException(' Invalid file type, please send a .json file to create report ');
      }
          
      return await this.appService.mustacheLaTex( inputFields );
  }

}
