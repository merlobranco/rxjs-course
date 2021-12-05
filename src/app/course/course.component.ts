import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { searchLessons } from '../../../server/search-lessons.route';
import {  debug, RxJsLoggingLevel, setRxjsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLoggingLevel.INFO, "course value")
            );

        setRxjsLoggingLevel(RxJsLoggingLevel.DEBUG);
    }

    ngAfterViewInit() {
        this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => (<HTMLInputElement>(<Event>event).target).value),
                startWith(''), // It will provide an initial value of string empry to the search parameter
                debug(RxJsLoggingLevel.TRACE, "search"),
                debounceTime(400), // Value provided in milliseconds
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJsLoggingLevel.DEBUG, "lessons value"),
            );
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
            map(res => res["payload"])
        );
    }


}
