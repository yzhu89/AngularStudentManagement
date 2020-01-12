import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    classeNameNeedToReg: string;
    courses: CourseDto[] = [];
    coursesWithTN: CourseWithTNDto[] = [];

    createCourseName: string = '';
    createCourseLocation: string = '';
    createCourseContent: string = '';
    createCourseTeacherId: string = '';
    createCourseNum: number = 0;

    private currentUserCredential: String;
    //newCourse: CourseDto;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        debugger;
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN().subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    // registerCourse(courseName) {
    //
    // }

    clearAllCourses() {
        this.courses = [];
    }

    addCourseToStudent() {
        const courseName = 'temp';
        this.courseService.addCourseToStudent(courseName, this.currentUserCredential);
    }
    deleteCourseToTeacher(deleteCourseName: String) {
        this.courses = [];
        this.courseService.delete(deleteCourseName).subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    createCourse() {
        const newCourse = new CourseDto();
        newCourse.courseNum = this.createCourseNum;
        newCourse.courseName = this.createCourseName;
        newCourse.courseLocation = this.createCourseLocation;
        newCourse.courseContent = this.createCourseContent;
        newCourse.teacherId = this.createCourseTeacherId;
        this.courseService.addCourse(newCourse).subscribe(response => {
            alert(response);
        });
    }
}
