import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './settings.entity';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<Settings> {
    return this.settingsService.getSettings();
  }

  @Put()
  async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    return this.settingsService.updateSettings(updateSettingsDto);
  }
}
