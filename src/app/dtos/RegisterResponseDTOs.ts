
export interface RegisterRequestDTO{
    name:string
    email:string
    mobileNumber:string
    dob:string
    accountType:'savings'| 'current'
    password:string
    confirmPassword:string
}

export interface RegisterResponse {
    accountNumber?:string
    email:string
    name:string
    otpReqId?:string
}

export interface VerifyPasswordResponse{
    email:string
    otp:string
    otpReqId:string
}

export interface ResetPasswordDTO {
    email:string
    reqId:string
    otp:string
    newPassword:string
    confirmPassword:string
}

export interface LoginRequestDTO{
    email:string
    password:string
}

export interface LoginResponse {
    email:string
    token:string
    expiresAt:string
}

export interface LoanFormDTO{
    noOfDependents:number
    education:'Graduate' | 'Not Graduate'
    selfEmployed:'Yes' | 'No'
    incomeAnnum:number
    loanAmount:number
    loanTerm:number
    cibilScore:number
    residentialAssetsValue:number
    commercialAssetsValue:number
    luxuryAssetsValue:number
    bankAssetValue:number
}

export interface LoanResponse extends LoanFormDTO{
    loanId:string,
    approvalStatus:string
    createdOn:string
}


export interface AccountInfo{
    name:string
    email:string
    mobileNumber:string
    accountType:string
    accountNumber:string
    balance:string
    dob:string
    createdOn:string
}

export type TransactionRequest = {senderAccountNumber:string,receiverAccountNumber:string,amount:number,transactionPassword:string};

export interface TransactionDTO{
    id?:number,
    accountNumber:string,
    senderAccountNumber?: string | null,
    receiverAccountNumber?: string | null,
    type : "transfer" | "deposit" | "withdraw",
    amount : Number,
    description : string,
    timestamp : string
}

export interface TransactionResponse{
  totalTransactions : number,
  transactionHistory : TransactionDTO[] 
}