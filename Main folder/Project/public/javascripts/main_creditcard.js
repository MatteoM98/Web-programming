//element
let name = document.getElementById('card-name');
let surname = document.getElementById('card-surname');
let number = document.getElementById('card-number');
let date = document.getElementById('card-date');
let type = document.getElementById('card-type');
let ccv = document.getElementById('card-ccv');
let sendButton = document.getElementById('send-button');
let showFormButton = document.getElementById('addCC');
let form = document.getElementById('modal');
let onlyNum = /^\d+$/;
let specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
let boolName = false;
let boolSurname = false;
let boolNumber = false;
let boolDate = false;
let boolCCV = false;

/* FUNCTION */

//Validation of 16 digits with Luhn's algorithm
function validateCardNumber(number) {
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number))
        return false;

    return luhnCheck(number);
}

function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) == 0;
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  //Function to recognize the type of credit card 
  function detectCardType(number) {
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    }

    for(var key in re) {
        if(re[key].test(number)) {
            return key
        }
    }

    return 'Unknown';
}


//eventListener
sendButton.addEventListener('click', event => {
    event.preventDefault();

    //name
    if(specialChar.test(name.value) || name.value == '') {
        name.style.backgroundColor = 'pink';
        boolName = false;
    }else {
        name.style.backgroundColor = '#99ff99';
        boolName = true;
    }

    //surname
    if(specialChar.test(surname.value) || surname.value == '') {
        surname.style.backgroundColor = 'pink';
        boolSurname = false;
    }else {
        surname.style.backgroundColor = '#99ff99';
        boolSurname = true;
    }

    //number
    if(!validateCardNumber(number.value)) {
        number.style.backgroundColor = 'pink';
        boolNumber = false;
    }else {
        number.style.backgroundColor = '#99ff99';
        boolNumber = true;
    }

    //type
    type.value = detectCardType(number.value);

    //date
    let sec = Date.parse(date.value);
    let now = new Date();
    let nowSec = now.getTime();
    if(sec - nowSec > 0) {
        date.style.backgroundColor = '#99ff99';
        boolDate = true;
    }else {
        date.style.backgroundColor = 'pink';
        boolDate = false;
    }

    //ccv
    if(!onlyNum.test(ccv.value)) {
        ccv.style.backgroundColor = 'pink';
        boolCCV = false;
    }else {
        ccv.style.backgroundColor = '#99ff99';
        boolCCV = true;
    }

    if(boolName && boolSurname && boolNumber && boolDate && boolCCV) {
        form.submit();
    }
    

});