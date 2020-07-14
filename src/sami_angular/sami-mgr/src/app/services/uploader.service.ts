import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import { environment } from "src/environments/environment";

import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class UploaderService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  addSource(source): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post(environment.apiUrl + "api/sources/" + Map + "/", source, options)
      .pipe(
        timeout(5000),
        tap(),
        catchError((err) => {
          return of({ error: "failed to add new source! ", err });
        })
      );
  }
}
