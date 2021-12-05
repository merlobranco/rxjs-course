import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    map,
    switchMap
} from 'rxjs/operators';
import {fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';
import { Store } from '../common/store.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: number;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute, private store: Store) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        // We want to send this http request at the same time to the backend in parallel and wait for the results of both of them
        this.course$ = this.store.selectCourseById(this.courseId);
        const lessons$ = this.loadLessons();

        forkJoin(this.course$, lessons$)
            .pipe(
                tap(([course, lessons]) => {
                    console.log('course', course);
                    console.log('lessons', lessons)
                })
            )
            .subscribe()
    }

    ngAfterViewInit() {
        this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => (<HTMLInputElement>(<Event>event).target).value),
                startWith(''), // It will provide an initial value of string empry to the search parameter
                debounceTime(400), // Value provided in milliseconds
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search))
            );
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
            map(res => res["payload"])
        );
    }


}
