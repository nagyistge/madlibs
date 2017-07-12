import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

declare var annyang: any;

@Injectable()
export class SpeechService {
  words$ = new Subject<{[key: string]: string}>();
  errors$ = new Subject<{[key: string]: any}>();
  listening = false;

  constructor() {}

  get speechSupported(): boolean {
    return !!annyang;
  }

  init() {
    const commands = {
      'noun :noun': (noun) => this.words$.next({type: 'noun', 'word': noun}),
      'verb :verb': (verb) => this.words$.next({type: 'verb', 'word': verb}),
      'adjective :adjective': (adj) => this.words$.next({type: 'adj', 'word': adj})
    };
    annyang.addCommands(commands);

    // annyang.addCallback('result', (userSaid) => {
    //   console.log('User may have said:', userSaid);
    // });
    annyang.addCallback('errorNetwork', (err) => {
      this._handleError('network', 'A network error occurred.', err);
    });
    annyang.addCallback('errorPermissionBlocked', (err) => {
      this._handleError('blocked', 'Browser blocked microphone permissions.', err);
    });
    annyang.addCallback('errorPermissionDenied', (err) => {
      this._handleError('denied', 'User denied microphone permissions.', err);
    });
    annyang.addCallback('resultNoMatch', (userSaid) => {
      this._handleError(
        'no match',
        'Spoken command not recognized. Say "noun [word]", "verb [word]", OR "adjective [word]".',
        { results: userSaid });
    });
  }

  private _handleError(error, msg, errObj) {
    this.errors$.next({
      error: error,
      message: msg,
      obj: errObj
    });
  }

  startListening() {
    annyang.start();
    this.listening = true;
  }

  abort() {
    annyang.abort();
    this.listening = false;
  }

}
