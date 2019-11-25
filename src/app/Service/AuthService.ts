import { Injectable } from '@angular/core';

interface AuthResponseData {
    id: number;
    Name: string;
    Email: string;
    Role: string;
    LoginAs: string; // primary and secondary
}


@Injectable()
export class AuthService{

    constructor( ) {

    }

    signUp(param: string| number ) {
        return 'Vijay Sahu';
    }
    getLoggedInUser() {

        return 'Vijay Sahu';
    }

    setCookies() {

    }

}// class end block
