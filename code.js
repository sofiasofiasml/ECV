var input = document.querySelector("textarea");
var state = document.querySelector("#horizontal_top aside#state");
var BoolEnter = true; 
var contEnter = 0; 
function sendMissage()
{
    var elem = document.createElement("p");  //div
    elem.className = "from-me"; 
    elem.innerText = input.value; 
    var chat = document.querySelector("#chat");
    chat.appendChild(elem); 
    input.value=""; 
    chat.scrollTop = 1000000; 
}

/*Change Status. Role of https://stackoverflow.com/questions/12797700/jquery-detect-change-in-input-field*/
const typer = document.getElementById('myTextbox1');
let timer, timeoutVal = 300; // time it takes to wait for user to stop typing in ms
/*When you write in input, change state: Escribiendo*/

text= document.querySelector('#myTextbox1'); 

input.addEventListener("keydown", OnKeyPress); 
/*Parentesis le pasas el resultado de la función, no la función*/
typer.addEventListener('keyup', handleKeyUp); /*Eventos: cuando sucede algo */
/* You stop writing. Role of https://dev.to/eaich/how-to-detect-when-the-user-stops-typing-3cm1*/
function handleKeyUp() {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
    state.innerHTML = 'En linea';
    if( contEnter>1 || BoolEnter == false)
    {
        input.value=""; 
        
        BoolEnter = true;  
        contEnter =0; 
    }
}, timeoutVal);
}
/*Shift+Enter: espacio
Enter solo con nada: salto de linea no envia
enter: envia, con contenido
Supr: Delate message send in chat
2 Enter without letter: clean message*/

function OnKeyPress(e)
{
    if(e.code == "Enter" && !e.shiftKey && input.value!="" && contEnter<1)
    {
        sendMissage(); 
        BoolEnter = false;  
    }
    if(e.code == "Delete")
    {
        var chat = document.querySelector("#chat");
        chat.innerHTML = "";
    }

    state.textContent="Escribiendo...";
        
}

document.addEventListener('keypress', logKey);

function logKey(e) {
    if(e.code == "Enter" && !e.shiftKey)
    {
        contEnter +=1; 
    }
    else{
        contEnter =0; 
    }
    
    
    
}

/*Finish Change Status*/