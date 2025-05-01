import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountInfo, LoanFormDTO, LoanResponse, LoginRequestDTO, LoginResponse, RegisterRequestDTO, RegisterResponse, ResetPasswordDTO, TransactionRequest, TransactionResponse } from '../dtos/RegisterResponseDTOs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
	private baseUrl = 'http://localhost:8080';
	private userMail;
	private BEARER_TOKEN;
	expiresAt: string = "";
	
	constructor(@Inject(HttpClient) private http: HttpClient) {
		this.userMail = localStorage.getItem("userMail") || "";
		this.BEARER_TOKEN = localStorage.getItem("bearerToken") || "";
		this.expiresAt = localStorage.getItem("expiresAt") || "";
	}

	static jsonheaders = new HttpHeaders({
		'Accept': 'application/json'
	});
	
	static textheaders = new HttpHeaders({
		'Accept': 'text/plain'
	});


	public isSessionInvalid(){
		return this.BEARER_TOKEN == null || this.BEARER_TOKEN.length < 4;
	}


	private api = {
		register:`${this.baseUrl}/auth/register`,
		authenticate:`${this.baseUrl}/auth/authenticate`,
		login:`${this.baseUrl}/auth/login`,
		logout:`${this.baseUrl}/auth/logout`,
		pwdReset:`${this.baseUrl}/auth/forgot-password`,
		verReset:`${this.baseUrl}/auth/reset-password`,
		submitLoan:`${this.baseUrl}/submitLoanApplication`,
		getLoans:`${this.baseUrl}/loans`,
		getLoanById:(id:string) => `${this.baseUrl}/loan/${id}`,
		accountDetails: `${this.baseUrl}/accountDetails`,
		accountNumbers: `${this.baseUrl}/accountNumbers`,
		transactionHistory:`${this.baseUrl}/transactions/history`,
		bankTransfer:`${this.baseUrl}/bank-transfer`,
		depoWithdraw:`${this.baseUrl}/depo-withdraw`,
		createSubAcc:`${this.baseUrl}/create-another-account`,
		initTpwdChange:`${this.baseUrl}/initTransactionPassword`,
		verTpwdChange:`${this.baseUrl}/changeTransactionPassword`,
	};
  

	setToken(data:LoginResponse){
		this.BEARER_TOKEN = data.token;
		this.userMail = data.email;
		this.expiresAt = data.expiresAt
		localStorage.setItem("userMail",this.userMail);
		localStorage.setItem("bearerToken",this.BEARER_TOKEN);
		localStorage.setItem("expiresAt",this.expiresAt);
	}

	getAuthHeader(){
		const headers = new HttpHeaders({
			'Authorization':`Bearer ${this.BEARER_TOKEN}`
		});
		return headers;
	}

	clearToken(){
		this.BEARER_TOKEN = "";
		this.userMail = "";
		this.expiresAt = "";
		localStorage.setItem("userMail",this.userMail);
		localStorage.setItem("bearerToken",this.BEARER_TOKEN);
		localStorage.setItem("expiresAt",this.expiresAt);
	}

	getToken(){
		return this.BEARER_TOKEN;
	}

	//Auth Controller
	register(userData: RegisterRequestDTO): Observable<RegisterResponse> {
		return this.http.post<RegisterResponse>(this.api.register,userData,{headers:UserService.jsonheaders});
	}

	authenticate(email: string,otpReqId:string, otp: string):Observable<RegisterResponse> {
		const params = new HttpParams()
		.set('email', email)
		.set('otpReqId',otpReqId)
		.set('otp', otp);
		return this.http.post<RegisterResponse>(this.api.authenticate,{}, {params});
	}

	login(credentials: LoginRequestDTO): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(this.api.login, credentials);
	}

	logout():Observable<null> {
		const result =  this.http.post<null>(this.api.logout,{},{headers:this.getAuthHeader()});
		this.clearToken();
		return result;
	}

	resetPwdInit(email:string): Observable<string> {
		const params = new HttpParams()
			.set('email',email);
		return this.http.post(this.api.pwdReset, {},{params,responseType:'text'});
	}

	verPwd(payload:ResetPasswordDTO){
		return this.http.post<null>(this.api.verReset,payload,{headers:UserService.jsonheaders});
	}

	//transaction apis
	getAccountDetails(){
		console.log(this.getAuthHeader());
		return this.http.get<AccountInfo[]>(this.api.accountDetails,{headers:this.getAuthHeader()});
	}

	getAccountNumbers(){
		return this.http.get<string[]>(this.api.accountNumbers,{headers:this.getAuthHeader()});
	}

	getTransactionHistory(accountNumber: string){
		const params = new HttpParams().set('accountNumber', accountNumber);
		return this.http.get<TransactionResponse>(this.api.transactionHistory,{params,headers:this.getAuthHeader()});
	}

	initiateTransfer(payload:TransactionRequest){
		return this.http.post<{message:string,senderBalance:string}>(this.api.bankTransfer,payload,{headers:this.getAuthHeader()});
	}

	depoWithdraw(payload:{accountNumber:string,transactionType:'deposit'|'withdraw',amount:number}){
		return this.http.post<null>(`${this.baseUrl}/depo-withdraw`,payload,{headers:this.getAuthHeader()});
	}

	createAnotherAccount(accountType : 'current'|'savings'): Observable<RegisterResponse> {
		const params = new HttpParams()
			.set('accountType',accountType);
		return this.http.post<RegisterResponse>(this.api.createSubAcc,{},{params,headers:this.getAuthHeader()});
	}

	sendTPwdOtp(accountNumber: string){
		const params = new HttpParams()
		.set('accountNumber',accountNumber);
		return this.http.post<string>(this.api.initTpwdChange, {}, { params,headers:this.getAuthHeader() ,responseType:'text' as 'json'});
	}

	resetTPwd(payload: { accountNumber: string; otpReqId:string; otp:string ;transactionPassword: string ; }) {
		return this.http.post<null>(this.api.verTpwdChange, payload,{headers:this.getAuthHeader()});
	}

	// Loan APIS
	applyLoan(payload:LoanFormDTO) : Observable<string> {
		return this.http.post(this.api.submitLoan, payload,{headers:this.getAuthHeader(),responseType:'text'});
	}

	getLoans(){
		return this.http.get<LoanResponse[]>(this.api.getLoans,{headers:this.getAuthHeader()});
	}

	getLoanData(loanId: string) {
		return this.http.get<LoanResponse>(this.api.getLoanById(loanId),{headers:this.getAuthHeader()});
	}

}

