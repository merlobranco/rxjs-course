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
            // Here we could provide any observable like fetch data from the db when the network is down
            /* 
              Maybe after getting the response of our request, or receiving an error,
                  We would like to fulfil one of the following cleaning operations:
                      1) Close a netwrok connection
                      2) Release a memory resource
                      3) Or send another common clean up operation
              For that purpose we will use the finalize operation

              Also we could apply different errors in the different position of the pipe chain
              Maybe some of them we want to be recovered and another ones no
            */
            catchError(err => {
                console.log("Error ocurred", err);
                // Since catchError needs an observable to be thrown 
                // will create an observable that errors out immediatly with this error without emitting any value
                return throwError(err);
            }),
            finalize(() => {
                console.log('Finalized executed...')
            }),
            tap(() => console.log("HTTP Request executed")),
            map(res => Object.values<Course>(res["payload"])),
            shareReplay()
            /*
                If We place the error handling and the finalize after the shareReplay
                They will be triggered twice since we have 2 subscriptions: 
                    1) one for beginner courses 
                    2) and another one for advanced courses
            */
        );

        this.beginnerCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'BEGINNER'))
        );
        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'ADVANCED'))
        );
    }

}
