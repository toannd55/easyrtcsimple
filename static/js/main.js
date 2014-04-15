var selfEasyrtcid = "";



/**
*Function: connect() tạo id ngẫu nhiên cho client, kết nối server
*
**/
function connect() {
	easyrtc.setPeerListener(addToConversation);
	easyrtc.setRoomOccupantListener(convertListToButtons);
	easyrtc.easyApp("easyrtc.audioVideo", "localVideo", ["remoteVideo"], loginSuccess, loginFailure);
}


/**
*
*
**/
function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    content = content.replace(/\n/g, '<br />');
    document.getElementById('conversation').innerHTML +=
    "<b>" + who + ":</b>&nbsp;" + content + "<br />";
}


/**
*Function clearConnectListMessage() xóa các other kết nối khác khỏi danh sách client
*
**/
function clearConnectList() {
	var otherClientDiv = document.getElementById('otherClients');
	while (otherClientDiv.hasChildNodes()) {
		otherClientDiv.removeChild(otherClientDiv.lastChild);
	}
}


/**
*Function convertListButtons(): tạo list các other kết nối, mỗi button tương ứng 1 other. Bấm vào button sẽ kết nối client đó.
*
**/
var idConnect = "";
function convertListToButtons (roomName, data, isPrimary) {
	//clearConnectListVideo();
	clearConnectList();
	var otherClientDivVideo = document.getElementById('otherClients');
	var otherClientDivMessage = document.getElementById('otherClients');
	
	
	document.getElementById("localVideo").style.border = "7px solid rgba(64,64,64, 0.6)";
	
	for(var easyrtcid in data) {
		
		//tao button ket noi video voi nhau
		var btnConnectVideo = document.createElement('button');
		btnConnectVideo.id = "buttonVideo_" + easyrtcid;
		btnConnectVideo.onclick = function(easyrtcid) {
			return function() {
                performCall(easyrtcid);
            };
		}(easyrtcid);

		var label = document.createTextNode(easyrtc.idToName(easyrtcid));
		btnConnectVideo.appendChild(label);
		otherClientDivVideo.appendChild(btnConnectVideo);
		
		//Tao button ket noi message
		var btnConnectMessage = document.createElement('button');
		btnConnectMessage.id = "buttonMessage_" + easyrtcid;		
        btnConnectMessage.onclick = function(easyrtcid) {
            return function() {
                sendStuffWS(easyrtcid);
            };
        }(easyrtcid);
        var label = document.createTextNode("Send to " + easyrtc.idToName(easyrtcid));
        btnConnectMessage.appendChild(label);
		otherClientDivMessage.appendChild(btnConnectMessage);
		btnConnectMessage.style.visibility = "hidden";
	}
}


/**
*Function: performCall() kết nối cuộc gọi video tới client khác.
*
**/
function performCall(otherEasyrtcid) {
	easyrtc.hangupAll();

	var successCB = function() {};
	var failureCB = function() {};
	easyrtc.call(otherEasyrtcid, successCB, failureCB);
	document.getElementById("remoteVideo").style.border = "3px solid rgba(64,64,64, 0.6)";
	
	idConnect = otherEasyrtcid;
	console.log(idConnect);
}

/**
*
*
**/
function connectMessageOfVideo(){
	document.getElementById("buttonMessage_" + idConnect).click();
	console.log("buttonMessage_" + idConnect);
}


/**
*
*
**/
function sendStuffWS(otherEasyrtcid) {
    var text = document.getElementById('sendMessage').value;
    if(text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }

    easyrtc.sendDataWS(otherEasyrtcid, "message",  text);
    addToConversation("Me", "message", text);
    document.getElementById('sendMessage').value = "";
}


/**
*Function: loginSuccess() trả về id của client nối kết nối server thành công
*
**/
function loginSuccess(easyrtcid) {
	selfEasyrtcid = easyrtcid;
	document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
}


/**
*Function loginFailure() show console nếu kết nối fail
*
**/
function loginFailure(errorCode, message) {
	easyrtc.showError(errorCode, message);
}