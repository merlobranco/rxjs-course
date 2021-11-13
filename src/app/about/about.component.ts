import { Component, OnInit } from '@angular/core';
import { noop, Observable} from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = new Observable(
      observer => {
        // Getting courses through a promise
        fetch('/api/courses')
          .then(response => {
            return response.json();
          })
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          })
      }
    );

    http$.subscribe(
      courses => console.log(courses),
      noop, // No operation. Replaces the empty callback () => {}
      () => console.log('completed')
    );
  }

}
