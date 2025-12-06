import { Injectable } from '@nestjs/common';
import { RouletteGateway } from './roulette.gateway';
import {ChzzkClient} from "chzzk";
import { SettingsService } from './settings/settings.service';

@Injectable()
export class AppService {
   constructor(
     private readonly rouletteGateway: RouletteGateway,
     private readonly settingsService: SettingsService,
   ) {}

   async onModuleInit() {
    console.log("Connecting to Chzzk...");
    const client = new ChzzkClient({
      nidAuth: process.env.NID_AUT!,
      nidSession: process.env.NID_SES!,
    })
    console.log(client);

    const result = await client.search.channels("누구셈")
    const channel = result.channels[0];

    console.log(channel)

    const chzzkChat = client.chat({
      channelId: process.env.CHANNEL_ID!,
      pollInterval: 30*1000
    })

    console.log(chzzkChat);

    chzzkChat.on('connect', () => {
      console.log('Connected to Chzzk chat!');
      this.rouletteGateway.server.emit('status', { status: 'connected' });
    })

    chzzkChat.on('chat', chat => {
      if (chat.message === "!rouletteDebug" && chat.profile.nickname === "MMMemory") {
        console.log('Chat message received:', chat);
        this.rouletteGateway.emitDonation({
          nickname: chat.profile.nickname ?? "익명",
          amount: 5000,
          message: "Debug command triggered roulette"
        })
      }
    })

    chzzkChat.on('donation', async (donation) => {
      console.log('Donation received:', donation);
      const settings = await this.settingsService.getSettings();

      // Check if roulette is active
      if (!settings.isActive) {
        console.log('Roulette is currently disabled. Donation ignored.');
        return;
      }

      const donationAmount = donation.extras.payAmount;
      const baseAmount = settings.donationAmount;
      let count = 0;

      if (settings.allowMultipleDonation) {
        // Allow multiples of the base amount
        if (donationAmount % baseAmount === 0) {
          count = Math.floor(donationAmount / baseAmount);
          console.log(`Multiple donation allowed: ${donationAmount} / ${baseAmount} = ${count} times`);
        } else {
          console.log(`Donation amount ${donationAmount} is not a multiple of ${baseAmount}. Donation ignored.`);
          return;
        }
      } else {
        // Only allow exact match
        if (donationAmount === baseAmount) {
          count = 1;
        } else {
          console.log(`Donation amount ${donationAmount} does not match base amount ${baseAmount}. Donation ignored.`);
          return;
        }
      }

      // Enqueue donation 'count' times
      for (let i = 0; i < count; i++) {
        this.rouletteGateway.emitDonation({
          nickname: donation.profile?.nickname?? "익명",
          amount: donation.extras.payAmount,
          message: donation.message,
        });
      }
      console.log(`Enqueued ${count} roulette(s) for ${donation.profile?.nickname ?? "익명"}`);
    })

    chzzkChat.connect();
   }

  getHello(): string {
    return 'Hello World!';
  }
}
