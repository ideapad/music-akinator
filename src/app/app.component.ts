import { Component, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

declare var Microm;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'music-akinator';

  private microm;
  private record;
  private recording = false;
  private url;
  private error;
  constructor(private domSanitizer: DomSanitizer, private http: HttpClient) {
  }

  ngOnInit() {
    this.microm = new Microm();
  }

  sanitize(url:string){
      return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  
  initiateRecording() {
      
      this.recording = true;
      let mediaConstraints = {
          video: false,
          audio: true
      };
      navigator.mediaDevices
          .getUserMedia(mediaConstraints)
          .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  /**
   * Will be called automatically.
   */
  successCallback(stream) {
      var options = {
          mimeType: "audio/wav",
          numberOfAudioChannels: 1
      };
      //Start Actuall Recording
      var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
      this.record = new StereoAudioRecorder(stream, options);
      this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording() {
      this.recording = false;
      this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob) {
      this.url = URL.createObjectURL(blob);
      this.processForRecognition();
  }
  /**
   * Process Error.
   */
  errorCallback(error) {
      this.error = 'Can not play audio in your browser';
  }


  processForRecognition() {
    const data = {
      url: this.url,
      return: 'timecode,apple_music,deezer,spotify',
      api_token: '2d9bdb6e6f225b189f6b4eaea1a1d1c1'
    }

    const header = {
      "Content-Type": "multipart/form-data"
    }

    this.http.post('https://api.audd.io/', data, { headers: header } ).subscribe(res => console.log(res), error => console.log(error));
  }
}
