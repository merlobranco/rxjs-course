import { Component, OnInit } from '@angular/core';
import { AsyncSubject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const subject = new ReplaySubject();
    const series$ = subject.asObservable();
    series$.subscribe(val => console.log("Early sub:" + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);
    // subject.complete();

    setTimeout(() => {
      series$.subscribe(val => console.log("Late sub:" + val));
      subject.next(4);
    }, 3000);


  }
}