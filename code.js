/*Atributes*/
var input = document.querySelector("textarea");
let timer, timeoutVal = 300; // time it takes to wait for user to stop typing in ms
var state = document.querySelector("#horizontal_top aside#state");
var BoolEnter = true; 
var contEnter = 0; 
var id = 0; 
var idPerson =0; 
var chat = document.querySelector("#chat");
var activeUser = "Grupal"; 
var msg = {
    type: "text",
    content: "",
    className: "from-me", 
    username: activeUser.id, 
    hidden: false
};
//global container to store important stuff
var DB = {
	msgs: [],
    user: [],
    nameUser: []
};
var OldKeyPres = "0"; 
var oneEmoji = false; 

var grupalClick = document.getElementById("Grupal");
var user1Click = document.getElementById("User1");
var user2Click = document.getElementById("User2");
var user3Click = document.getElementById("User3");
var user4Click = document.getElementById("User4");
var user5Click = document.getElementById("User5");

var MyName = document.getElementById("MyUserName");
var NameRoom = document.getElementById("RoomName"); 
var ActualRoom = "u137424_room"; 
//User
function User(){
    this.nameU = "Unknown";
    this.id = 0;   
}  
    
//SERVER
var server = new SillyClient();
server.connect( "wss://ecv-etic.upf.edu/node/9000/ws", ActualRoom);



server.on_ready = function( my_id )
{
	console.log("Connect server");
    console.log("ROOM: "+ ActualRoom); 
}

server.on_message = function( my_id, msg)
{
    
    if (typeof msg === 'string' || msg instanceof String)
    {
       var msg_obj =JSON.parse(msg); 
    }
    else{
        var msg_obj = msg; 
    }
    msg_obj.className = "from-them"; 
    chat.appendChild(ObjectToParagraf(msg_obj)); 
}


/*Hide messages sent by someone else*/
grupalClick.addEventListener("click", hiddenMessagesOtherUsers); 
user1Click.addEventListener("click", hiddenMessagesOtherUsers); 
user2Click.addEventListener("click", hiddenMessagesOtherUsers); 
user3Click.addEventListener("click", hiddenMessagesOtherUsers); 
user4Click.addEventListener("click", hiddenMessagesOtherUsers); 
user5Click.addEventListener("click", hiddenMessagesOtherUsers); 
input.addEventListener("click", knowUserConnect); 

function knowUserConnect(){
    var textRoomActual = document.getElementById("InformationRoom");
    textRoomActual.textContent = "Room: " + ActualRoom + "\nUsers Connected: "+server.num_clients; 
}
function hiddenMessagesOtherUsers()
{
    //Change active Person 
    activeUser = this.id; 
    activePerson(this); 
    for(var j = 0; j< DB.msgs.length; j++){
        // don't see the message
        if(DB.msgs[j].username != this.id)
        {
            DB.msgs[j].hidden = true;  
            chat.childNodes[j].style.display ="none"; 
        }
        else{
            DB.msgs[j].hidden = false; 
            //If the message is not from the selected user, it should not be seen
            chat.childNodes[j].style.display =""; 
        }
    }
}


//Save in DataBase the message
function onMessage(id,msg)
{
	//store message
    var msg_str = JSON.stringify(msg);
    var msg_obj = JSON.parse(msg_str);
    //SEND MESSAGE IN SERVER
    if(msg_obj.username == "Grupal"){
        server.sendMessage( msg_str);
    }
    else{
        for(var i=0; i<DB.user.length; i++){
            if(msg_obj.username == DB.user[i]){
                console.log(DB.nameUser[i]); 
                server.sendMessage( msg_str, [DB.nameUser[i].value]);
            }
        }
    }
	DB.msgs.push(msg_obj); 
}

function createNewUser()
{
    var newUser = new User(); 
    idPerson +=1; 
    if(idPerson < 6){
        newUser.id = "User"+idPerson; 
        newUser.nameU = document.querySelector("#nameUser"); 
                
        var node = document.getElementById(newUser.id);
        node.setAttribute("class", "Person"); 
        node.setAttribute("click", "seeMessagePerson"); 

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
        var nameUer= ""+ newUser.nameU.value; 
        DB.nameUser.push(nameUer); 
        newUser.nameU.value = ""; // Clean input
        activeUser = document.getElementById(newUser.id).id;
        DB.user.push(newUser.id); 

        //Change Person is active
        activePerson(node); 
    }
    else{
        alert("Not mush Person"); 
    }
}


/*Change color background person is active talking */
function activePerson(user)
{ 
    if( user.id == "Grupal"){
        user.style.background = 'rgba(143, 141, 141, 0.2)'; 
        user.style.borderRadius = '50px'; 
    }
    else{
        var userClick = document.getElementById("Grupal");
        userClick.style.background = 'rgba(143, 141, 141, 0)'; 
        userClick.style.borderRadius = '0px'; 
    }
    for(var i= 0; i < DB.user.length; i++)
    {
        if(user.id == DB.user[i])
        {
            user.style.background = 'rgba(143, 141, 141, 0.2)'; 
            user.style.borderRadius = '50px'; 
        }
        else{
            var userClick = document.getElementById(DB.user[i]);
            userClick.style.background = 'rgba(143, 141, 141, 0)'; 
            userClick.style.borderRadius = '0px'; 
            
        }        
    }
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
    msg.username = activeUser;
    
    //save message in DB 
    onMessage(id,msg); 
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

/*No writing: switch to online*/
input.addEventListener('keyup', handleKeyUp); 
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

/*
Shift+Enter: line break
Enter only with nothing: do not send line break
Enter: send, with content
Del: Send all messages
Press more than once Enter without content: clear textarea
type ':' and press 'control' after: emoji
*/

input.addEventListener("keydown", OnKeyPress); 
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
    if(OldKeyPres == ":" && e.key == "Control" && !oneEmoji){
        var text = input.value; 
        input.value =text.slice(0,-1); 
        input.value += String.fromCodePoint(0x1F600);
        oneEmoji= true; 
    }
    if(e.key != "Control"){
        oneEmoji = false; 
    }
    
    state.textContent="Escribiendo...";
}
/*When you write in input, change state: Escribiendo*/
document.addEventListener('keypress', logKey);

function logKey(e) {

    OldKeyPres = e.key;
    if(e.code == "Enter" && !e.shiftKey)
    {
        contEnter +=1; 
    }
    else{
        contEnter =0; 
    }    
}
/*Configuration*/
function ChangeNameRoom()
{
    var NameUser = document.getElementById("NameMyUser");
    var OldName = document.getElementById("NameMyUser").value;
    //Capital first letter
    if(MyName.value !=""){
        NameUser.textContent=MyName.value.charAt(0).toUpperCase() + MyName.value.slice(1); 
    }
    ActualRoom = NameRoom.value; 
    changeRoom(); 
    MyName.value =""; 
    NameRoom.value =""; 
}
//CHANGE THE ROOM OF SERVER
function changeRoom(){
    console.log("ROOM: "+ ActualRoom); 
    server.connect( "wss://ecv-etic.upf.edu/node/9000/ws", ActualRoom);
    //Change text Room
    var textRoomActual = document.getElementById("InformationRoom");
    textRoomActual.textContent = "Room: " + ActualRoom + " Users Connected: "+server.num_clients; 
    
}
/*Overlay: Add user*/
function togglePopup()
{
    document.getElementById("popup-CreteNewUser").classList.toggle("active"); 
}
/*Overlay: Room configuration and username*/
function togglePopupConfig()
{
    document.getElementById("popup-ChangeNameRoom").classList.toggle("active"); 
}
