
function sendMissage()
{
    var input = document.querySelector("input");
    var elem = document.createElement("p");
    elem.className = "from-me"; 
    elem.innerText = input.value; 
    var chat = document.querySelector("#chat");
    chat.appendChild(elem)
    input.value=" "; 
}

/*Change Status. Role of https://stackoverflow.com/questions/12797700/jquery-detect-change-in-input-field*/
const typer = document.getElementById('myTextbox1');
const status = document.getElementById('state');
let timer, timeoutVal = 300; // time it takes to wait for user to stop typing in ms
/*When you write in input, change state: Escribiendo*/
$('#myTextbox1').on('input', function() {
    status.textContent="Escribiendo...";
});

typer.addEventListener('keyup', handleKeyUp);
/* You stop writing. Role of https://dev.to/eaich/how-to-detect-when-the-user-stops-typing-3cm1*/
function handleKeyUp() {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
    status.innerHTML = 'En linea';
}, timeoutVal);
}
/*Finish Change Status*/