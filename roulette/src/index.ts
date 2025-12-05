import './localization';
import { Roulette } from './roulette';
import options from './options';
import { registerServiceWorker } from './registerServiceWorker';
import { io } from 'socket.io-client';

import { RouletteManager } from './rouletteManager';
import { getSettings } from './api/settingsApi';

const roulette = new Roulette();
(window as any).roulette = roulette;
(window as any).options = options;

registerServiceWorker();

// Socket 연결
const socket = io('http://localhost:3000/roulette');

// RouletteManager 세팅
const manager = RouletteManager.instance;
manager.onStartRoulette = async (job) => {

    function shuffle(array: Array<any>) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }

    document.getElementsByTagName('canvas')[0].style.display = 'block';
    console.log(job);

    // Get settings from API
    const settings = await getSettings();
    const items = [...Array(settings.dudCount).fill("꽝"), ...settings.prizes];
    shuffle(items);

    roulette.setMarbles(items);
    roulette.start();

    // 여기서 roulette이 끝났다는 걸 감지할 방법이 필요 — 예: roulette 이벤트 리스너 또는 Promise 래핑
    return new Promise<void>((resolve) => {
        roulette.addEventListener('goal', () => {
            resolve();
        });
    });
};

manager.onShowResult = (job, result) => {
    // 예: 화면에 결과 표시
    //   alert(`Donation from ${job.donation.nickname} result: ${result}`);
};

manager.onClearScreen = () => {
    document.getElementsByTagName('canvas')[0].style.display = 'none';
}
// 필요하다면 onClearScreen 정의

manager.init();

// WebSocket event → 큐에 넣기
socket.on('donation', (donation: { nickname: string; amount: number; message: string }) => {
    console.log('Donation received, enqueueing roulette job', donation);
    manager.enqueueDonation(donation);
});