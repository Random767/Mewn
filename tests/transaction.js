const transaction = require('./../modules/transaction')



// template de como deve funcionar o módulo de transação
const dateNow = Date.now()
transaction.log("daily", {"reciver_id": 633764019559202836, "amount": 600, "timestamp": dateNow, "messaage": ""});
transaction.log("pay", {"sender_id" : 0, "reciver_id": 0, "amount": 0, "timesamp": 0, "messaage": ""})

/*
{
    "sender_id": 0,
    "reciver_id": 0,
    "amount": 0,
    "timestamp": 0,
    "status": "",
    "message": ""
}
*/