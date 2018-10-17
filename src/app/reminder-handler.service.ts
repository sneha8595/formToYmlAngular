import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { schedule } from "node-schedule";
import * as moment from 'moment';

@Injectable({
  providedIn: "root"
})
export class ReminderHandlerService {
  constructor(private http: HttpClient) {}

  /** GET order details from the server using POST */
  sendInstantMessage(mNumber, message): Observable<any> {
    const connectUrl = "https://qa-umpapi.imimobile.net/resources/v1/messaging"; // connect api url
    const postData = {
      correlationid: "cid",
      conversationid: "",
      callbackData: "",
      notifyurl: "",
      route: "",
      deliverychannel: "sms",
      message: {
        template: "",
        parameters: {
          "sms.message": "param"
        }
      },
      channels: {
        sms: {
          text: message,
          type: "1",
          senderid: "CONNCT"
        }
      },
      destination: [
        {
          msisdn: [mNumber]
        }
      ]
    };

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        key: "1f9b2397-810c-11e8-a15f-005056944c2b"
      })
    };
    return this.http
      .post<any>(connectUrl, postData, httpOptions)
      .pipe(catchError(this.handleError("sendInstantMessage", null)));
  }

  queueReminder(mNumber, message, scheduledTime) {
    //schedule reminder using cron
    // const now = moment(new Date());
    // scheduledTime = moment(scheduledTime);
    // const duration = moment.duration(now.diff(scheduledTime));
    // const diffInMonths = duration.asMonths();
    // const diffInDays = duration.asDays();
    // const diffInHours = duration.asHours();
    // const diffInSeconds = duration.asSeconds();
    // if(diffInMonths)
    schedule.scheduleJob(scheduledTime, () => {
      this.sendInstantMessage(mNumber, message);
      console.log("running a task");
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
