import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private toast: HotToastService) {}

  public notifyInfo(message: string) {
    this.toast.info(message, {
      style: {
        'min-width': '20%',
      },
    });
  }

  public notifyError(errorRes: any) {
    let errorMessage = 'An unknown error occurred';
    if (errorRes.hasOwnProperty('error')) {
      errorMessage = errorRes.error.message;
    }
    this.toast.error(errorMessage, {
      style: {
        width: '20%',
        color: 'white',
        'background-color': '#ff3333',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#ff3333',
      },
    });
  }

  public notifySuccess(message: string) {
    this.toast.success(message, {
      style: {
        'min-width': '20%',
        color: 'white',
        'background-color': '#53a653',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#4BB543',
      },
    });
  }
}
