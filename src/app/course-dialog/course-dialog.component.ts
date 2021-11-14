import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {concat, fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    // Angular provides at the level of the form an Observable that emits the values that are contain in the form
    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {
        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                // We want to guarantee the values are saved in the same order as they are emmitted
                // Our safe operations are happening in sequence in the same order we want to trigger them
                // Completing one first and then the other
                concatMap(changes => this.saveCourse(changes))
            )
            .subscribe()
    }

    async saveCourse(changes) {
        fromPromise(fetch(`/api/courses/${this.course.id}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }

    ngAfterViewInit() {
        fromEvent(this.saveButton.nativeElement, 'click')
        .pipe(
            // The new values will be ignored as long as the ongoing observable is not completed
            // We want to manage one click, trigger the save request, and while the safe request is not completed the rest of the clicks will be ignored
            exhaustMap(() => this.saveCourse(this.form.value))
        ).subscribe();

    }



    close() {
        this.dialogRef.close();
    }

}
