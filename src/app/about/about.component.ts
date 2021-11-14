import { Component, OnInit } from '@angular/core';
import { concat, interval, of } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // const source1$ = interval(1000);
    const source1$ = of(1, 2, 3);
    // The value of source2$ never will be added since the source1$ is never completed
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    const result$ = concat(source1$, source2$, source3$);

    result$.subscribe(console.log)
  }
}