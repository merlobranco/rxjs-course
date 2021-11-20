import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {
    }

    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');

        const courses$: Observable<Course[]> = http$.pipe(
            tap(() => console.log("HTTP Request executed")),
            map(res => Object.values<Course>(res["payload"])),
            shareReplay(),
            // After the time elapse, then retryWhen will subscribe to the http$ observable
            // and trigger a new http request
            retryWhen(errors => errors.pipe(
                /* 
                    We should use delayWhen NOT delay 
                    If we use delay, we will delay the whole error stream by a total of 2 seconds
                    We want after each error to wait fot 2 seconds
                */
                delayWhen(() => timer(2000))
            ))
        );

        this.beginnerCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'BEGINNER'))
        );
        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'ADVANCED'))
        );
    }

}
