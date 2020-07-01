import { environment } from "../../environments/environment";

import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import { CookieService } from "ngx-cookie-service";

import { MapService } from "./map.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  currentUser;

  private authenticated = false;
  private authToken = { access: null, refresh: null };

  constructor(private http: HttpClient, private cookieService: CookieService) {}

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
        }),
        catchError((err) => {
          console.log(err);
          return of({ error: "falied to login user!" });
        })
      );
  }

  logout(): void {
    this.authenticated = false;
    this.authToken = { access: null, refresh: null };
    this.cookieService.set("JWT_TOKEN", null);
    this.cookieService.set("JWT_REFRESH_TOKEN", null);
    this.currentUser = null;
  }

  // GET/auth/users/me/ - endpoint that gets current active user
  // required params - needs jwt accept token
  getUser(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http.get(environment.apiUrl + "auth/users/me/", options).pipe(
      // timeout(1000),
      tap((user) => {
        this.currentUser = user["username"];
      }),
      catchError((err) => {
        return of({ error: "failed to retrieve user!" });
      })
    );
  }

  getUsername(): string {
    return this.currentUser;
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
}
