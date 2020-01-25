import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuddSongReponse } from './audd-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {
  private formData: FormData;

  constructor(private http: HttpClient) {
      this.formData = new FormData();
      this.formData.append('return', 'timecode,deezer');
      this.formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
   }

  processForAudioRecognition(file: File): Observable<AuddSongReponse> {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    return this.http.post('https://api.audd.io/', formData).pipe(
      map(result => result as AuddSongReponse));
  }

  processForHummingRecognition(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    return this.http.post('https://api.audd.io/', formData);
  }

  processForLyricsRecognition(text: string): Observable<any> {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('q', text);
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');

    return this.http.post('https://api.audd.io/findLyrics/', formData);
  }
}
