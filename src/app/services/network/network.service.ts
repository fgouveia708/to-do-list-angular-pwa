import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private connectionStatus$ = new Subject<boolean>();

  constructor() {
    window.addEventListener('online', () => this.updateConnectionStatus());
    window.addEventListener('offline', () => this.updateConnectionStatus());
  }

  get isOnline(): boolean {
    return !!window.navigator.onLine;
  }

  get connectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  updateConnectionStatus() {
    this.connectionStatus$.next(this.isOnline);
  }
}
