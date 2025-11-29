
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IUser } from './../user/interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;



  constructor(private toastr: ToastrService, private router: Router) { }

  private hubConnection: HubConnection;

  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();


  createHubConnection(user: IUser) {



    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .then(function () {
        console.log("Single R Connected")
      })
      .catch(error => console.log(error));

    this.hubConnection.on('userIsOnline', username => {

      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username])
      })


    })

    this.hubConnection.on('userIsOffline', username => {

      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(x => x !== username)])
      })
    })


    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {

      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived', ({ username, Name }) => {
      this.toastr.info(username + ' has sent you a new message!')
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl('/core/messages'));
    })


  }
  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
