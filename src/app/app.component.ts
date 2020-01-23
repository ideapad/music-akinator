import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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

  constructor(private domSanitizer: DomSanitizer, private http: HttpClient) {
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

  play() {
    this.microm.play();
  }

  // downloadMp3() {
  //   var fileName = 'cat_voice';
  //   this.microm.download(fileName);
  // }

  sanitize(url:string){
      return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  processForRecognition(file: File) {
    const formData = new FormData();
    formData.append('return', 'timecode,apple_music,deezer,spotify');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    this.http.post('https://api.audd.io/', formData).subscribe(res => console.log(res), error => console.log(error));
  }

  recognizeLyrics(text: string) {
    const formData = new FormData();
    formData.append('q', text);
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');

    this.http.post('https://api.audd.io/findLyrics/', formData).subscribe(res => console.log(res), error => console.log(error));
  }
}
