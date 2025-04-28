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
  static jsonheaders = new HttpHeaders({
    'Accept': 'application/json'
  });
  static textheaders = new HttpHeaders({
    'Accept': 'text/plain'
  });

  setToken(token: string){
    this.userMail = token;
  }

  getToken(){
    return this.userMail;
  }

  // 🔐 Register a new user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-account`,userData,{headers:UserService.jsonheaders});
  }

  createAnotherAccount(accountType : string): Observable<any> {
    const params = new HttpParams()
        .set('accountType',accountType)
        .set('email',this.getToken());
    return this.http.post(`${this.baseUrl}/create-another-account`,{},{params,headers:UserService.jsonheaders});
  }

  // 🔓 Login user
  login(credentials: { email: string | null; password: string | null}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }


  getAccountDetails(){
    const params = new HttpParams().set('email',this.getToken());
    return this.http.post(`${this.baseUrl}/accountDetails`, null,{params});
  }

  getAccountNumbers(){
    const params = new HttpParams().set('email',this.getToken());
    return this.http.get(`${this.baseUrl}/accountNumbers`, {params});
  }

  getTransactionHistory<T>(accountNumber: string){
    const params = new HttpParams().set('accountNumber',accountNumber);
    return this.http.post<T>(`${this.baseUrl}/transaction-history`, null,{params});
  }

  initiateTransfer(payload:any){
    return this.http.post(`${this.baseUrl}/bank-transfer`,payload,{headers:UserService.jsonheaders});
  }

  depoWithdraw(payload:any){
    return this.http.post(`${this.baseUrl}/depo-withdraw`,payload,{headers:UserService.jsonheaders});
  }

  applyLoan(payload:any){
    return this.http.post(`${this.baseUrl}/submitLoanApplication`,{...payload,email:this.userMail},{headers:UserService.jsonheaders,responseType:'text' as 'json'});
  }

  verifyRegistrationOtp(email: string,otpReqId:string, otp: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('otpReqId',otpReqId)
      .set('otp', otp);
      
    return this.http.post<any>(`${this.baseUrl}/verify-activation-code`, {}, { params });
  }

  sendForgotOtp(email: string){
    const params = new HttpParams()
      .set('email', email);
    return this.http.post<string>(`${this.baseUrl}/initiatePasswordReset`, {}, { params ,responseType:'text' as 'json'});
  }

  sendTPwdOtp(accountNumber: string){
    const params = new HttpParams()
      .set('accountNumber',accountNumber)
      .set('email', this.getToken());
    return this.http.post<string>(`${this.baseUrl}/initTransactionPassword`, {}, { params ,responseType:'text' as 'json'});
  }

  // 🔁 Reset password
  resetPassword(payload: { email: string; reqId:string; otp:string ;newPassword: string ; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, payload,{headers:UserService.jsonheaders});
  }

  resetTPwd(payload: { accountNumber: string; otpReqId:string; otp:string ;transactionPassword: string ; }): Observable<any> {
    const params = new HttpParams()
      .set('accountNumber',payload.accountNumber)
      .set('email', this.getToken())
      .set('otpReqId',payload.otpReqId)
      .set('otp',payload.otp)
      .set('transactionPassword',payload.transactionPassword);
    return this.http.post(`${this.baseUrl}/changeTransactionPassword`, {},{params});
  }

  getLoans(){
    const params = new HttpParams()
      .set('email', this.userMail);
    return this.http.get(`${this.baseUrl}/loans`,{params,headers:UserService.jsonheaders});
  }

  getLoanData(loanId: string) {
    return this.http.get(`${this.baseUrl}/loan/${loanId}`,{headers:UserService.jsonheaders});
  }

}

