export const environment = {

  production: false,

  apiBaseUrl:
    'https://192.168.0.29:8766',

  auth: {

    signin:'/auth/signin',
    generateOtp:'/auth/generateOtp',
    verifyOtp:'/auth/verifyOtp'

  },
 

  loan: {
    emiCalculation: '/loan-repayment/emi-calculation',
    loanDetail:'/loan-detail',
  },

  genericValue: '/generic-value' , 
  country: '/country' ,
  
  document: {
    checkList: '/process_stage/fetchCheckListForScreen',  
    upload: '/dms/upload',                               
    linkToOrigination: '/origination-doc',              
    ocrSave: '/pyDocument/savePyDoc', 
    fetchDocument: '/pyDocument/fetchDocument',                   
  },
 
  stageId: 653,
  screenCode: 456,
 


};
