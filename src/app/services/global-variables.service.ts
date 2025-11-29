import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  constructor() { }

  private sessionName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sessionName$: Observable<string> = this.sessionName.asObservable();

  private sessionId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sessionId$: Observable<string> = this.sessionId.asObservable();


  sessionChange(updatedSession, updatedSessionId) {
      this.sessionName.next(updatedSession);
      this.sessionId.next(updatedSessionId)
  }
}
