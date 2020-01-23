import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuddReponseModel } from './audd-response.mode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {

  constructor(private http: HttpClient) { }

  processForAudioRecognition(file: File): Observable<AuddReponseModel> {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    return this.http.post('https://api.audd.io/', formData).pipe(
      map(result => result as AuddReponseModel));
  }

  processForHummingRecognition(file: File): Observable<AuddReponseModel> {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    return this.http.post('https://api.audd.io/', formData).pipe(
      map(result => result as AuddReponseModel));
  }

  processForLyricsRecognition(text: string) {
    const formData = new FormData();
    formData.append('q', text);
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');

    this.http.post('https://api.audd.io/findLyrics/', formData).subscribe(res => console.log(res), error => console.log(error));
  }
}
