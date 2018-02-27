import { Component, Input } from '@angular/core';

/**
 * Generated class for the BookListRankComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'book-list-rank',
  templateUrl: 'book-list-rank.html'
})
export class BookListRankComponent {
  @Input() hasRank: boolean;
  @Input() hasSearch: boolean;
  text: string;
  bookList: Array<any> = [];
  constructor() {
    console.log('Hello BookListRankComponent Component');
    this.text = 'Hello World';
    this.getRankList();
  }

  getRankList(e?): void {
    console.log('开始加载排行榜')
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        this.bookList.push({ rank: this.bookList.length + 1 })
      }
      if (e) {
        e.complete()
      }
    }, 2000);


  }
  getMoreRankList(e): void {
    this.getRankList(e);
  }
}