import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async onModuleInit() {
    // Initialize settings if not exists
    const count = await this.settingsRepository.count();
    if (count === 0) {
      const defaultSettings = this.settingsRepository.create({
        dudCount: 40,
        prizes: ['노래', '대사', '방제', '게임권'],
        donationAmount: 5000,
        isActive: true,
        allowMultipleDonation: false,
      });
      await this.settingsRepository.save(defaultSettings);
    }
  }

  async getSettings(): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      throw new Error('Settings not found');
    }
    return settings;
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.getSettings();

    if (updateSettingsDto.dudCount !== undefined) {
      settings.dudCount = updateSettingsDto.dudCount;
    }
    if (updateSettingsDto.prizes !== undefined) {
      settings.prizes = updateSettingsDto.prizes;
    }
    if (updateSettingsDto.donationAmount !== undefined) {
      settings.donationAmount = updateSettingsDto.donationAmount;
    }
    if (updateSettingsDto.isActive !== undefined) {
      settings.isActive = updateSettingsDto.isActive;
    }
    if (updateSettingsDto.allowMultipleDonation !== undefined) {
      settings.allowMultipleDonation = updateSettingsDto.allowMultipleDonation;
    }

    return this.settingsRepository.save(settings);
  }
}
