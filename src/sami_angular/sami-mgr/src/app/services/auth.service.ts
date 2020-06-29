import { environment } from "../../environments/environment";

import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import { CookieService } from "ngx-cookie-service";

import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  public myuser;

  private authenticated = false;
  private authToken = { access: null, refresh: null };

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  // GET/auth/users/me/ - endpoint that gets current active user
  // required params - needs jwt accept token
  getCurrentUser(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http.get(environment.apiUrl + "auth/users/me/", options).pipe(
      // timeout(1000),
      catchError((err) => {
        return of({ error: "failed to retrieve users!" });
      })
    );
  }

  // POST/auth/users/ - endpoint that allows registration of new users
  // required params - username, password
  // No authentication required
  registerNewUser(
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email: string
  ): Observable<any> {
    const newUser = {
      username,
      password,
      firstname,
      lastname,
      email,
    };
    return this.http
      .post<any>(environment.apiUrl + "auth/users/", newUser, this.httpOptions)
      .pipe(
        // timeout(10000),
        catchError((err) => {
          return of({ error: "failed to register user!" });
        })
      );
  }

  // POST/users/authenticate - logs in user and returns access and refresh jwt tokens
  // params - username, password
  // No authentication required
  login(username: string, password: string): Observable<any> {
    const login = {
      username,
      password,
    };
    return this.http
      .post<any>(
        environment.apiUrl + "auth/jwt/create/",
        login,
        this.httpOptions
      )
      .pipe(
        // timeout(1000),
        tap((response: any) => {
          this.setToken(response.access, response.refresh);
          this.loadCredentials();
        }),
        catchError((err) => {
          console.log(err);
          return of({ error: "falied to login user!" });
        })
      );
  }

  logout(): void {
    // need to send refresh token to server to invalidate stored token?
    this.authenticated = false;
    this.authToken = { access: null, refresh: null };
    this.cookieService.set("JWT_TOKEN", null);
    this.cookieService.set("JWT_REFRESH_TOKEN", null);
    this.myuser = null;
  }

  userIsAuthenticated(): boolean {
    return this.authenticated;
  }

  getAuthToken(): string {
    return this.authToken.access;
  }

  getAuthRefreshToken(): string {
    return this.authToken.refresh;
  }

  checkForStoredToken(token, rToken): void {
    if (token && token !== null && token !== "null") {
      this.setToken(token, rToken);
    }
  }

  setToken(token, rToken) {
    this.authToken = {
      access: token,
      refresh: rToken,
    };
    this.cookieService.set("JWT_TOKEN", token);
    this.cookieService.set("JWT_REFRESH_TOKEN", rToken);
    this.authenticated = true;
  }

  loadCredentials(): void {
    this.getCurrentUser().subscribe((myuser) => {
      this.myuser = [myuser.username];
    });
  }

  getUsername(): string {
    return this.myuser;
  }
}
