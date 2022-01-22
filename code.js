var input = document.querySelector("textarea");
var list = document.querySelector("li");
var state = document.querySelector("#horizontal_top aside#state");
var BoolEnter = true; 
var contEnter = 0; 
var id = 0; 
var idPerson =0; 
var activeUser = "Unknown"; 
var msg = {
    type: "text",
    content: "",
    className: "from-me", 
    username: activeUser
};
//SERVER
var server = new SillyClient();
server.connect( "wss://ecv-etic.upf.edu/node/9000/ws", "u137424_room");
server.on_ready = function( my_id )
{
	console.log("Connect server");
}

server.on_message = function( my_id, msg)
{
	console.log("HOLA MESSAGE", msg);
}

//global container to store important stuff
var DB = {
	msgs: []
};


list.addEventListener("click", seeMessagePerson); 
function seeMessagePerson()
{
    for(var i =0; i< list.parentElement.childNodes.length; i++)
    {
        console.log(list.parentElement.childNodes[i].id); 
       
    }
    
}

//Save in DataBase the message
function onMessage(id,msg)
{
	//store message
    var msg_str = JSON.stringify(msg);
	DB.msgs.push( msg_str ); 
    console.log(DB); 
	//displayMessage( msg );
}

//Canal global CHAT

function User(){
    this.nameU = "Unknown";
    this.id = 0; 
    this.conversation = [];  
}

function createNewUser()
{
    var newUser = new User(); 
    idPerson +=1; 
    newUser.id = idPerson; 
    newUser.nameU = document.querySelector("#nameUser"); 
    
    console.log(newUser.nameU.value); 
    
    var node = document.createElement('li');
    node.setAttribute("id", newUser.id); 
    //node.className= "Person"; 
    node.setAttribute("class", "Person"); 
    node.setAttribute("onclick", "seeMessagePerson()"); 

    var imag = document.createElement('img');
    imag.setAttribute("src", "img/user.png");

    var nameList = document.createElement('h5');
    if(newUser.nameU.value =="" || newUser.nameU.value ==" ")
    {
        newUser.nameU.value = "Unknown"; 
    }
    nameList.textContent = newUser.nameU.value; 
    nameList.setAttribute("display", "none");
    
    node.appendChild(imag);
    node.appendChild(nameList);
    newUser.nameU.value = ""; // Clean input
    document.querySelector('ul').appendChild(node);
}


// Pass Object.msg in Object.paragraf
function ObjectToParagraf(msg)
{
    var elm = document.createElement("p");  //div
    elm.classList = msg.className; 
    elm.innerText = msg.content; 
    return elm; 
}

function sendMissage()
{
    id +=1; 
    msg.content = input.value; 
    //save message in DB 
    onMessage(id,msg); 
    var chat = document.querySelector("#chat");
    chat.appendChild(ObjectToParagraf(msg)); 
    input.value=""; 
    chat.scrollTop = 1000000; 
}

function ButtonSendMessage()
{
    if(input.value!=""){
        sendMissage()
    }
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

function togglePopup()
{
    document.getElementById("popup-1").classList.toggle("active"); 
}
