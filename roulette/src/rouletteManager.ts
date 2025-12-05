// src/RouletteManager.ts
import { DonationPayload, getSocket } from './socket';

export interface Donation {
  nickname: string;
  amount: number;
  message?: string;
}

type RouletteState = 'IDLE' | 'RUNNING' | 'SHOWING_RESULT';

interface RouletteJob {
  id: string;
  donation: DonationPayload;
}

export class RouletteManager {
  private static _instance: RouletteManager;
  static get instance() {
    if (!this._instance) this._instance = new RouletteManager();
    return this._instance;
  }

  private queue: RouletteJob[] = [];
  private state: RouletteState = 'IDLE';

  // 결과를 얼마나 보여줄지 (ms)
  private resultDisplayDuration = 7000; // 7초 정도

  // 외부에서 실제 roulette 엔진을 실행하기 위해 주입받는 콜백들
  // 실제 게임 코드에 맞게 타입/인자 바꿔 쓰면 됨
  onStartRoulette: ((job: RouletteJob) => Promise<void> | void) | null = null;
  onStopRoulette: (() => void) | null = null;
  onShowResult: ((job: RouletteJob, result: any) => void) | null = null;
  onClearScreen: (() => void) | null = null;

  init() {
    const socket = getSocket();
    socket.on('donation', (payload: DonationPayload) => {
      console.log('[socket] donation', payload);
    //   this.enqueueDonation(payload);
    });
  }

  public enqueueDonation(donation: DonationPayload) {
    const job: RouletteJob = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      donation,
    };
    this.queue.push(job);
    this.tryRunNext();
  }

  private async tryRunNext() {
    if (this.state !== 'IDLE') return;
    const next = this.queue.shift();
    console.log('[RouletteManager] tryRunNext shifted', next);
    console.log('[RouletteManager] current queue', this.queue);
    if (!next) return;

    this.state = 'RUNNING';
    try {
      if (this.onStartRoulette) {
        // 실제 roulette 엔진 실행
        const result = await this.runRoulette(next);
        // 결과 표시 단계
        await this.showResult(next, result);
      } else {
        console.warn('[RouletteManager] onStartRoulette not set');
      }
    } catch (err) {
      console.error('[RouletteManager] error while running roulette', err);
    } finally {
      this.state = 'IDLE';
      // 다음 큐 처리
      this.tryRunNext();
    }
  }

  private runRoulette(job: RouletteJob): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.onStartRoulette) return resolve(null);

      // onStartRoulette 내부에서 실제 게임 시작 + 끝났을 때 resolve 호출해야 함
      try {
        const maybePromise = this.onStartRoulette(job);
        // onStartRoulette 가 Promise로 결과를 주는 형태라면 그대로 사용
        if (maybePromise instanceof Promise) {
          maybePromise.then(resolve).catch(reject);
        } else {
          // 별도의 finish 콜백 방식이면, 그 콜백에서 resolve() 호출해야 함
          // 이 브랜치는 필요 없다면 제거 가능
          resolve(null);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  private async showResult(job: RouletteJob, result: any) {
    this.state = 'SHOWING_RESULT';
    if (this.onShowResult) {
      this.onShowResult(job, result);
    }
    await new Promise((res) => setTimeout(res, this.resultDisplayDuration));
    if (this.onClearScreen) {
      this.onClearScreen();
    }
    this.state = 'IDLE';
  }
}
