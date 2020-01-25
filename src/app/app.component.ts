import { RecognitionService } from './recognition/audio-recognition.service';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { trigger, style, state, transition, animate } from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var Microm;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'scale(0)', opacity: 0}),
          animate('1000ms ease', style({transform: 'scale(1)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'scale(1)', opacity: 1}),
          animate('1000ms ease', style({transform: 'scale(0)', opacity: 0}))
        ])
      ]
    )
  ]
})
export class AppComponent {
  title = 'myApp';

  private microm;
  musicLink: string;
  favoriteSeason: string;
  inputTypes: string[] = ['Song', 'Humming', 'Lyrics'];
  private recordingFile: File;
  public music: AuddSongReponse;
  public mp3UrlTets;

  isRecording = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  wavesurfer: any;

  constructor(private domSanitizer: DomSanitizer, private http: HttpClient, private recognitionService: RecognitionService, private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.microm = new Microm();

    this.firstFormGroup = this._formBuilder.group({
      inputType: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      inputData: ['', Validators.required]
    });
  }

  isLyrics(): boolean {
    return this.firstFormGroup.controls['inputType'].value == 'Lyrics'
  }

  isLyricsEmpty() {
    return this.secondFormGroup.controls['inputData'].value == '';
  }

  recognizeSound(file) {
    switch (this.firstFormGroup.controls['inputType'].value) {
      case 'Song' :
        this.recognitionService.processForAudioRecognition(file).subscribe(res => {
          this.music = res;
          this.secondFormGroup.controls['inputData'].setErrors(null);
        });
        break;
      
      case 'Humming':
        this.recognitionService.processForHummingRecognition(file).subscribe(res => {
          this.music = {
            result: {
              artist: res.result.list[0].artist,
              title: res.result.list[0].title
            }
          } as AuddSongReponse;
          this.secondFormGroup.controls['inputData'].setErrors(null);
        });
        break;
    }
  }

  recognizeLyrics() {
    const lyricsText = this.secondFormGroup.controls['inputData'].value;
    this.recognitionService.processForLyricsRecognition(lyricsText).subscribe(res => {
      this.music = {
        result: {
          artist: res.result[0].artist,
          title: res.result[0].title,
          album: res.result[0].album
        }
      } as AuddSongReponse;
    });
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  }

  isRecordingDone(): boolean {
    return !this.recordingFile;
  }

  start() {
    this.microm.record().then(function() {
      console.log('recording...')
      this.isRecording = true;
    }.bind(this)).catch(function() {
      console.log('error recording');
      this.isRecording = false;
    }.bind(this));
  }

  isNotRecognized(result: any) {
    return result.status == 'success' && result.result == null;
  }

  async stop() {
    const result = await this.microm.stop();

    console.log(result);
    console.log(this.isRecording);

    this.isRecording = false;
    const mp3 = result;
    this.mp3UrlTets = result.url;

    this.recordingFile = new File(mp3.buffer, 'me-at-thevoice.mp3', {
      type: mp3.blob.type,
      lastModified: Date.now()
    });

    this.recognizeSound(this.recordingFile);
  }

  processForRecognition(file: File) {
    const formData = new FormData();
    formData.append('return', 'timecode,deezer');
    formData.append('api_token', '2d9bdb6e6f225b189f6b4eaea1a1d1c1');
    formData.append('file', file, 'to_recognize.mp3');

    this.http.post('https://api.audd.io/', formData).pipe(
      map(result => result as AuddSongReponse))
      .subscribe(
        res => {
          this.music = res;
          console.log(res);
          this.secondFormGroup.controls['inputData'].setErrors(null);
        },
        error => console.log(error));
  }
}

class AuddSongReponse {
  status: string;
  result: {
    artist: string;
    title: string;
    album: string;
    deezer: {
      preview: string;
      artist: {
        picture_small: string;
      };
      album: {
        cover_big: string;
      }
    }
  };
}
