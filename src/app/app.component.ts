import { RecognitionService } from './recognition/audio-recording.service';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

declare var Microm;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myApp';

  private microm;
  public mp3Url;
  musicLink: string;

  constructor(private domSanitizer: DomSanitizer, private http: HttpClient, private recognitionService: RecognitionService) {
  }

  ngOnInit() {
    this.microm = new Microm();
  }


  start() {
    this.microm.record().then(function() {
      console.log('recording...')
    }).catch(function() {
      console.log('error recording');
    });
  }

  async stop() {
    const result = await this.microm.stop();
    const mp3 = result;
    console.log(mp3.url, mp3.blob, mp3.buffer);
    this.mp3Url = mp3.url;

    const file = new File(mp3.buffer, 'me-at-thevoice.mp3', {
      type: mp3.blob.type,
      lastModified: Date.now()
    });

    this.processForRecognition(file);
  }

  sanitize(url:string){
      return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  processForRecognition(file: File) {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    this.http.post('https://api.audd.io/', formData).pipe(
      map(result => result as AuddReponse))
      .subscribe(
        res => {
          this.musicLink = res.result.deezer.preview;
          console.log(res)},
        error => console.log(error));
  }

  recognizeLyrics(text: string) {
    const formData = new FormData();
    formData.append('q', text);
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');

    this.http.post('https://api.audd.io/findLyrics/', formData).subscribe(res => console.log(res), error => console.log(error));
  }

}

class AuddReponse {
  status: string;
  result: {
    deezer: {
      preview: string
    }
  };
}
