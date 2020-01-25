import { Injectable } from '@angular/core';

declare var Microm;

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private microm: any;

  constructor() {
    this.microm = new Microm();
  }

  startRecording(): Promise<any> {
    return this.microm.record();
  }

  stopRecording(): Promise<any> {
    return this.microm.stop();
  }
}
