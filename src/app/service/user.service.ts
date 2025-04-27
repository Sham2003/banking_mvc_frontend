import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080';

  private userMail = "";
  constructor(@Inject(HttpClient) private http: HttpClient) {}
  static headers = new HttpHeaders({
    'Accept': 'application/json'
  });

  setToken(token: string){
    this.userMail = token;
  }

  getToken(){
    return this.userMail;
  }

  // 🔐 Register a new user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-account`,userData,{headers:UserService.headers});
  }

  // 🔓 Login user
  login(credentials: { email: string | null; password: string | null}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // 🔁 Reset password
  resetPassword(payload: { email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-pass`, payload);
  }

  viewAccount(token : string){
    const params = new HttpParams().set('email',token);
    return this.http.post(`${this.baseUrl}/view-account`, null,{params});
  }

  getTransactionHistory<T>(accountNumber: string){
    const params = new HttpParams().set('accountNumber',accountNumber);
    return this.http.post<T>(`${this.baseUrl}/transaction-history`, null,{params});
  }

  initiateTransfer(payload:any){
    return this.http.post(`${this.baseUrl}/bank-transfer`,payload,{headers:UserService.headers});
  }

  depoWithdraw(payload:any){
    return this.http.post(`${this.baseUrl}/depo-withdraw`,payload,{headers:UserService.headers});
  }

  applyLoan(payload:any){
    return this.http.post(`${this.baseUrl}/submitLoanApplication`,payload,{headers:UserService.headers});
  }

  verifyRegistrationOtp(email: string, otp: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('otp', otp);
      
    return this.http.post<any>(`${this.baseUrl}/verify-activation-code`, {}, { params });
  }
}

