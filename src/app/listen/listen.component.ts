import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MadlibsService } from './../madlibs.service';
import { SpeechService } from './../speech.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit, OnDestroy {
  nouns: any[] = [{id: 0, word: ''}, {id: 1, word: ''}, {id: 2, word: ''}];
  verbs: any[] = [{id: 0, word: ''}, {id: 1, word: ''}, {id: 2, word: ''}];
  adjs: any[] = [{id: 0, word: ''}, {id: 1, word: ''}, {id: 2, word: ''}];
  nounSub: Subscription;
  verbSub: Subscription;
  adjSub: Subscription;

  constructor(
    private ml: MadlibsService,
    public speech: SpeechService,
    private zone: NgZone) { }

  ngOnInit() {
    this.speech.init();

    this._listenNouns();
    this._listenVerbs();
    this._listenAdj();
  }

  private _listenNouns() {
    this.nounSub = this.speech.words$
      .filter(obj => obj.type === 'noun')
      .map(nounObj => nounObj.word)
      .subscribe(
        (noun) => {
          this.zone.run(() => {
            this.nouns = this._updateWords(this.nouns, noun);
          });
        }
      );
  }

  private _listenVerbs() {
    this.nounSub = this.speech.words$
      .filter(obj => obj.type === 'verb')
      .map(verbObj => verbObj.word)
      .subscribe(
        (verb) => {
          this.zone.run(() => {
            this.verbs = this._updateWords(this.verbs, verb);
          });
        }
      );
  }

  private _listenAdj() {
    this.nounSub = this.speech.words$
      .filter(obj => obj.type === 'adj')
      .map(adjObj => adjObj.word)
      .subscribe(
        (adj) => {
          this.zone.run(() => {
            this.adjs = this._updateWords(this.adjs, adj);
          });
        }
      );
  }

  _updateWords(arr, newWord) {
    let added = false;
    return arr.map((item, i) => {
      if (!item.word && !added) {
        added = true;
        return {id: item.id, word: newWord};
      } else {
        return item;
      }
    });
  }

  trackWords(index, word) {
    return word ? word.id : undefined;
  }

  done() {
    console.log(this.nouns, this.verbs, this.adjs);
  }

  ngOnDestroy() {
    this.nounSub.unsubscribe();
    this.verbSub.unsubscribe();
    this.adjSub.unsubscribe();
  }

}
