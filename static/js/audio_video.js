var selfEasyrtcid = "";
 

/**
*Ham connectAudioVideo(): tao phong, id nguoi dung, ket noi toi nguoi dung khac
*
**/
function connectAudioVideo() {
	easyrtc.setPeerListener(addToConversation);
	easyrtc.setRoomOccupantListener(convertListToButtons);
	easyrtc.easyApp("easyrtc.audioVideo", "localVideo", ["remoteVideo"], loginSuccess, loginFailure);
	//easyrtc.connect("easyrtc.instantMessaging",loginSuccess, loginFailure);
}
 

/**
*
*
**/
function addToConversation(who, msgType, content){
	content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	content = content.replace(/\n/g, "<br />");
	document.getElementById("conversation").innerHTML +=
	"<b>" + who + ":</b>&nbsp;" + content + "<br />";
}


/**
*
*
**/


/**
*Ham xoa danh sach nguoi dung
*
**/
function clearConnectList() {
	var otherClientDiv = document.getElementById("otherClients");
	while (otherClientDiv.hasChildNodes()) {
		otherClientDiv.removeChild(otherClientDiv.lastChild);
	}
}


/**
*
*
**/
var id = "";
function convertListToButtons (roomName, data, isPrimary) {
	clearConnectList();
	var otherClientDiv = document.getElementById("otherClients");
	var btnSendMessage = document.getElementById("btnSend");
	
	document.getElementById("localVideo").style.border = "7px solid rgba(64,64,64, 0.6)";
	
	for(var easyrtcid in data) {
		var button = document.createElement("button");
		button.onclick = function(easyrtcid) {
			return function() {
				performCall(easyrtcid);
				//sendStuffWS(easyrtcid);
			};
		}(easyrtcid);
		
		btnSendMessage.onclick = function(easyrtcid) {
			return function() {
				sendStuffWS(easyrtcid);
			}
		}(easyrtcid);
		
		document.getElementById("otherClients").innerHTML = "Kết nối tới: ";
		var label = document.createTextNode(easyrtc.idToName(easyrtcid));
		button.appendChild(label);
		otherClientDiv.appendChild(button);
		break;
	}
	
	//Chinh style cho button
	button.style.marginLeft = "20px";
	button.style.backgroundColor = "#e3dceb";
	button.style.border = "1px #566963";
	button.style.borderRadius = "0px";
	button.style.padding = "8px 20px";
	button.style.font = "16px arial";
	button.style.cursor = "pointer";
	button.style.color = "#1f1f1f";
	button.style.display = "inline-box";
	button.style.textDecoration = "none";
}

/**
*
*
**/
function performCall(otherEasyrtcid) {
	easyrtc.hangupAll();
 
	var successCB = function() {};
	var failureCB = function() {};
	easyrtc.call(otherEasyrtcid, successCB, failureCB);
}
 

 /**
 *
 *
 **/
 function sendStuffWS(otherEasyrtcid) {
	var text = document.getElementById("sendMessage").value;
	if(text.replace(/\s/g, "").length === 0) { // Don"t send just whitespace
		return;
	}
 
	easyrtc.sendDataWS(otherEasyrtcid, "message",  text);
	addToConversation("Me", "message", text);
	document.getElementById("sendMessage").value = "";
}

 
function loginSuccess(easyrtcid) {
	selfEasyrtcid = easyrtcid;
	//document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
	//style cho localVideo
}


/**
*
*
**/
function loginFailure(errorCode, message) {
	easyrtc.showError(errorCode, message);
}