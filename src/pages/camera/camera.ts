
// import { Component } from '@angular/core';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NavController,Platform,IonicPage} from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import {Toast} from "@ionic-native/toast";
import 'rxjs/add/operator/first';
declare var AlloyCrop;

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  @ViewChild('cameraPreviewContainer') container: ElementRef;
  private previewOpts: CameraPreviewOptions;
  private takeOpts: CameraPreviewPictureOptions ={
    width:400,
    height:300,
    quality:50
  };
  private colorFilters: string[] = [
    'NONE',
    'MONO',
    'NEGATIVE',
    'POSTERIZE',
    'SEPIA'
  ];

  private cropSrc: string ;
  private imgSrc: string ;

  private currentColorFilterIndex: number = 0;

  constructor(
    private platform: Platform
    , private cameraPreview: CameraPreview
    , private base64ToGallery: Base64ToGallery
    , private toast: Toast
  ) {}
  takePicture() {
    this.cameraPreview.takePicture({
      width: this.takeOpts.width,
      height: this.takeOpts.height,
      quality: 50
    })
      .then(pic => {
        // this.base64ToGallery.base64ToGallery(pic[0], null)
        this.cropSrc = 'data:image/jpeg;base64,' + pic;
        this.imgSrc = 'data:image/jpeg;base64,' + pic;
      })
      .then(() => {
        this.toast.show('Picture taken and saved to gallery', '5000', 'center').subscribe();
        this.ngOnDestroy();
      })
      .catch(e => console.log(e));
  }

  reverseCamera() {
    this.cameraPreview.switchCamera()
      .catch(e => console.log(e));
  }

  changeFilter() {
    this.currentColorFilterIndex++;
    if (this.currentColorFilterIndex > 4) this.currentColorFilterIndex = 0;
    this.cameraPreview.setColorEffect(this.colorFilters[this.currentColorFilterIndex])
      .catch(e => console.log(e));
  }

  ngAfterViewInit() {
    this.platform.ready()
      .then(() => {
        // not really needed, but just in case

        const el: HTMLElement = this.container.nativeElement;

        const options: CameraPreviewOptions = this.previewOpts = {
          y: el.getBoundingClientRect().top,
          width:400,
          height: 300
        };

        this.cameraPreview.startCamera(options)
          .then(() => {
            console.log('Camera preview started!');
          })
          .catch(e => {
            console.log('Error starting camera preview', e);
          });

      });
  }

  private startCamera(){
    const el: HTMLElement = this.container.nativeElement;
    
    const options: CameraPreviewOptions = this.previewOpts = {
      y: el.getBoundingClientRect().top,
      width:400,
      height: 300
    };
    
    this.cameraPreview.startCamera(options)
    .then(() => {
      console.log('Camera preview started!');
    })
    .catch(e => {
      console.log('Error starting camera preview', e);
    });
  }

  ngOnDestroy() {
    this.cameraPreview.stopCamera().catch(() => {});
  }

  private switchCamera(){
    this.cameraPreview.switchCamera();
  }

  private stopCamera(){
    this.cameraPreview.stopCamera();
  }

  crop() {
    new AlloyCrop({//api:https://github.com/AlloyTeam/AlloyCrop
      image_src: this.imgSrc,
      circle: true, // optional parameters , the default value is false
      width: 256, // crop width
      height: 256, // crop height
      output: 1, // output resolution --> 400*200
      ok: (base64, canvas) => {
        this.cropSrc = base64;
      },
      cancel: () => {
      },
      ok_text: "确定", // optional parameters , the default value is ok
      cancel_text: "取消" // optional parameters , the default value is cancel
    });
  }

}
