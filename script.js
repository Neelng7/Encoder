var database = firebase.database();
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@%&()?/>`~^<|;[]*#-_$=+}':., ";
const symbols_9 = ".19[!+&-*";
const encryptionOperaters = ["*","+","*","+","*","+","*","+8","*","*","+8","+","*","+12","+3","+","+4","+","*","*"];
const decryptionOperaters = ["/","-","/","-","/","-","/","-8","/","/","-8","-","/","-12","-3","-","-4","-","/","/"];

function generateID(){
   const rand10_15 = 10 + Math.floor(Math.random()*5);
    var randID = [];

    for(let i=0; i<rand10_15; i++){
        const rand1_76 = Math.floor(Math.random()*76);
        randID.push(symbols[rand1_76]);
    }
    document.getElementById("incriptionId-e").value = randID.join("");
}
function generateIdSno(){
    var IDSno = [];
    for(let i=0; i<25; i++){
        IDSno.push(1+Math.floor(Math.random()*8));
    }
    globalThis.randSno = IDSno.join("");
}

const a1 = document.getElementsByTagName("a")[0].classList;
const a2 = document.getElementsByTagName("a")[1].classList;
const encoderDiv = document.getElementById("encoder").classList;
const decoderDiv = document.getElementById("decoder").classList;
if(window.location.href.split("#")[1]!=undefined) anchorChange(window.location.href.split("#")[1]);

function anchorChange(type){
    window.location.href = `#${type}`;
    const pageType = window.location.href.split("#")[1];

    if(pageType == "encrypt"){
        a1.toggle("selected",true);
        a2.toggle("selected", false);
        encoderDiv.toggle("hide", false);
        decoderDiv.toggle("hide", true);    
    }else if(pageType == "decrypt"){
        a1.toggle("selected", false);
        a2.toggle("selected", true);
        encoderDiv.toggle("hide", true);
        decoderDiv.toggle("hide", false);
    }
}

function encryptionData(){
    const enteredID = document.getElementById("incriptionId-e").value;
    var IDSno;

    if(enteredID.includes(".")||enteredID.includes("#")||enteredID.includes("$")) alert('ID cannot contain ".", "#", "$", "[", or "]"');
    else if(enteredID.includes("[")||enteredID.includes("]")) alert('ID cannot contain ".", "#", "$", "[", or "]"');
    else if(enteredID.length>20||enteredID.length<10) alert("ID must be between 10-20 characters");
    else if(document.getElementById("mssgInp-e").value == "") alert("Message cannot be empty");

    else if(enteredID != null){
        var IDSno_ref  = database.ref('/IDs/ID: ' + enteredID);
        IDSno_ref.once("value",function(data){
        IDSno = data.val();

        if(IDSno != null) encrypt(IDSno.slice(5,));
        else{
            generateIdSno();
            database.ref("/IDs/").update({
            [`ID: ${enteredID}`]: randSno.toString()
            });
            encrypt(randSno.slice(5,));
        }
        });
    }
}

function encrypt(IdSno){

    const originalMssg = document.getElementById("mssgInp-e").value;
    const mssgOut = document.getElementById("mssgOut-e");
    const mssgLenght = originalMssg.length;
    const mssgIndex = [];
    const decryptedMssg = [];

    const arrayTimes = Math.ceil(mssgLenght/20);
    const IdSnoModiify = IdSno.repeat(arrayTimes);
    const encryptionOperatersModify = (encryptionOperaters.join(",")+",").repeat(arrayTimes).split(",");

    const symbolsModify = symbols.repeat(9);

    for(let i=0; i<mssgLenght; i++){
        const n = eval(symbols.indexOf(originalMssg[i])+encryptionOperatersModify[i]+(10-IdSnoModiify[i]));
        decryptedMssg.push(symbolsModify[n]);
        mssgIndex.push(symbols_9[Math.floor((n)/92)]);
    }
    mssgOut.value = mssgIndex.join("")+decryptedMssg.join("");

}

function decryptionData(){
    const enteredID = document.getElementById("incriptionId-d").value;
    var IDSno;

    if(enteredID.includes(".")||enteredID.includes("#")||enteredID.includes("$")) alert('ID cannot contain ".", "#", "$", "[", or "]"');
    else if(enteredID.includes("[")||enteredID.includes("]")) alert('ID cannot contain ".", "#", "$", "[", or "]"');
    else if(enteredID.length>20||enteredID.length<10) alert("ID must be between 10-20 characters");
    else if(document.getElementById("mssgInp-d").value == "") alert("Message cannot be empty");
    else if(enteredID != null){
        var IDSno_ref  = database.ref('/IDs/ID: ' + enteredID);
            IDSno_ref.once("value",function(data){
            IDSno = data.val();

            if(IDSno != null) decrypt(IDSno.slice(5,).toString());
            else alert("ID is invalid");
        });
    }
}

function decrypt(IDSno){
    const originalMssg = document.getElementById("mssgInp-d").value;
    const mssgOut = document.getElementById("mssgOut-d");
    const mssgLenght = originalMssg.length/2; 
    const mssgIndex = [];
    const decryptedMssg = [];

    const arrayTimes = Math.ceil(mssgLenght/20);
    const IdSnoModiify = IDSno.repeat(arrayTimes);
    const decryptionOperatersModify = (decryptionOperaters.join(",")+",").repeat(arrayTimes).split(",");

    const symbolsModify = symbols.repeat(9);

    for(let i=0; i<mssgLenght; i++){ 

        var mssgNew_1 = symbols_9.indexOf(originalMssg.slice(0,mssgLenght)[i]);
        var mssgNew_2 = symbols.indexOf(originalMssg.slice(mssgLenght,)[i]);
        var mssgNew_2M = mssgNew_2 + 92*mssgNew_1;

        decryptedMssg.push(symbolsModify[eval(mssgNew_2M+decryptionOperatersModify[i]+(10-IdSnoModiify[i]))]);

    }
    mssgOut.value = decryptedMssg.join("");
}

function copy(id){
    navigator.clipboard.writeText(document.getElementById(id).value);
    alert("Copied to Clipboard");
}
