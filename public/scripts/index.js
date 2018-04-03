

function addUser() {
	var requestJson = {};
	requestJson.firstName = document.getElementById('firstName').value;
	requestJson.lastName = document.getElementById('lastName').value;
	requestJson.company = document.getElementById('company').value;
	requestJson.city = document.getElementById('city').value;
	console.log("==========================");
	console.log(requestJson);
	if(requestJson.firstName == "" ){
		console.log()
		alert("First Name cannot be blank ");
		return;
	}else if(requestJson.lastName == "" ){
		console.log()
		alert("Last Name cannot be blank ");
		return;
	}else if(requestJson.company == "" ){
		console.log()
		alert("Email Id cannot be blank ");
		return;
	}else if(requestJson.city == "" ){
		console.log()
		alert("City cannot be blank ");
		return;
	}
	
     var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/addCustomerDetails", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			
			if(xhttp.status == 200){
				document.forms['userAdd'].reset()
				alert("User successfully added");
			}else{
				alert("Failed to add user. Try again");
			}
		}
	};
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(requestJson));
	
}



function uploadFile(){
	if(document.getElementById('title').value == "" ){
		alert("Title cannot be blank ");
		return false;
	}else if(document.getElementById('description').value == "" ){
		alert("Description cannot be blank ");
		return false;
	}else if(document.getElementById("upload").files[0] == undefined ){
		alert("No file selected");
		return false;
	}
	
	var data = new FormData();
	data.append("title",document.getElementById('title').value);
	data.append("description",document.getElementById('description').value);
	data.append("upload", document.getElementById("upload").files[0]);
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/uploadFile", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			if(xhttp.status == 200){
				document.forms['fileUploadForm'].reset()
				alert("File uploaded successfully");
			}else{
				alert("Failed to upload file. Try again");
			}
		}
	};
    xhttp.setRequestHeader("enctype", "multipart/form-data");
    xhttp.send(data); 
	return false;
}

function resetUploadForm(){
	document.forms['fileUploadForm'].reset()
}

function fetchUser() {
	//location.reload();
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "api/getCustomerDetails", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			 
			if(xhttp.status == 200){
				var searchUserResp = JSON.parse(xhttp.responseText)
	
				var userCount  = searchUserResp.respBody.total_rows
				
				
				var searchTable = document.getElementById("searchTable");
				
				//searchTable.deleteRow(0); 
				
				while(searchTable.rows.length > 0) {
				  searchTable.deleteRow(0);
				}
				var row = searchTable.insertRow(0);
				row.innerHTML = '<td style="text-align:center;" colspan=4><button class="addBtn" class="searchUserTile" onclick="fetchUser()">Search</button> <button class="addBtn" class="searchUserTile" onclick="'+"location.href='index.html'"+'">Back</button></td>'
				if(userCount == 0){
					var row = searchTable.insertRow(0);
					row.innerHTML = '<td style="text-align:center;" colspan=4>No Records Available</td>'
				
				}
				for (var i = 0; i < userCount; i++) {
					
					var user = searchUserResp.respBody.rows[i];
					
					var rowNumber = document.getElementById("searchTable").rows.length; 
					console.log(rowNumber);
					var row = searchTable.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					cell1.innerHTML = user.doc.firstName;
					cell2.innerHTML = user.doc.lastName;
					cell3.innerHTML = user.doc.company;
					cell4.innerHTML = user.doc.city;
				}
				var header = searchTable.createTHead();
				var row = header.insertRow(0);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				cell1.innerHTML = "<b>First Name</b>";
				cell2.innerHTML = "<b>Last Name</b>";
				cell3.innerHTML = "<b>Company</b>";
				cell4.innerHTML = "<b>City</b>";
				row.style.backgroundColor = "black";
			}else{
				alert("Failed to fetch user details. Try again");
			} 
			
			
		}
	};
	
	xhttp.timeout = 100000;
	xhttp.send();
	
	
}

function searchFiles() {
	//location.reload();
	var requestJson = {};
	requestJson.title = document.getElementById('title').value;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "api/searchFiles", true);
	xhttp.onreadystatechange = function(){
		//console.log(xhttp);
		 if(xhttp.readyState == 4){
			//console.log(xhttp);
			 
			if(xhttp.status == 200){
				var searchFilesResp = JSON.parse(xhttp.responseText)
				//console.log(searchFilesResp);
	
				var documentCount  = searchFilesResp.respBody.docs.length;
				
				
				var searchTable = document.getElementById("searchTable");
				
				//searchTable.deleteRow(0); 
				
				while(searchTable.rows.length > 0) {
				  searchTable.deleteRow(0);
				}
				var row = searchTable.insertRow(0);
				row.innerHTML = '<td style="text-align:center;" colspan=4> <button class="addBtn" class="searchUserTile" onclick="'+"location.href='fileSearch.html'"+'">Back</button></td>'
				if(documentCount == 0){
					var row = searchTable.insertRow(0);
					row.innerHTML = '<td style="text-align:center;" colspan=4>No Records Available</td>'
				
				}
				for (var i = 0; i < documentCount; i++) {
					
					var file = searchFilesResp.respBody.docs[i];
					
					var rowNumber = document.getElementById("searchTable").rows.length; 
					console.log(rowNumber);
					var row = searchTable.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					cell1.innerHTML = file.title;
					cell2.innerHTML = file.description;
					cell3.innerHTML = file.creationDate;
					/* cell4.innerHTML = ''file.newFileName; */
					//cell4.innerHTML = '<a href="#" onclick="downloadFiles();" title="My link title">'+file.newFileName+'</a>';
					cell4.innerHTML = '<a href=# onclick="return downloadFiles(\'' +searchFilesResp.respBody.fileDownloadContextUrl + '\',\''+ file._id +'\',\'' + file.newFileName  +'\')">'+file.newFileName+'</a>';
				}
				var header = searchTable.createTHead();
				var row = header.insertRow(0);
				var cell1 = row.insertCell(0);	
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				cell1.innerHTML = "<b>Title</b>";
				cell2.innerHTML = "<b>Description</b>";
				cell3.innerHTML = "<b>Creation Date</b>";
				cell4.innerHTML = "<b>File Name</b>";
				row.style.backgroundColor = "black";
			}else{
				alert("Failed to fetch user details. Try again");
			} 
			
			
		} 
	};
	
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(requestJson));
	
	
}

function addUserInfo(){
	if(document.getElementById('firstName').value == "" ){
		alert("First Name cannot be blank ");
		return false;
	}else if(document.getElementById('lastName').value == "" ){
		alert("Last Name cannot be blank ");
		return false;
	}else if(document.getElementById('accType').value == "" ){
		alert("Account Type cannot be blank ");
		return false;
	}else if(document.getElementById('userEmail').value == "" ){
		alert("User Email cannot be blank ");
		return false;
	}else if(document.getElementById("imageUpload").files[0] == undefined ){
		alert("No image selected");
		return false;
	}
	
	var data = new FormData();
	data.append("firstName",document.getElementById('firstName').value);
	data.append("middleName",document.getElementById('middleName').value);
	data.append("lastName",document.getElementById('lastName').value);
	data.append("accType",document.getElementById('accType').value);
	data.append("userEmail",document.getElementById('userEmail').value);
	data.append("imageUpload", document.getElementById("imageUpload").files[0]);
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/addUserInfo", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			if(xhttp.status == 200){
				document.forms['fileUploadForm'].reset()
				alert("User information added successfully");
			}else{
				alert("Failed to add user information. Try again");
			}
		}
	};
    xhttp.setRequestHeader("enctype", "multipart/form-data");
    xhttp.send(data); 
	return false;
}

function searchUsers() {
	//location.reload();
	console.log("within Search Users");
	var requestJson = {};
	requestJson.userName = document.getElementById('userName').value;
	requestJson.emailId = document.getElementById('emailId').value;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "api/searchUsers", true);
	xhttp.onreadystatechange = function(){
		//console.log(xhttp);
		 if(xhttp.readyState == 4){
			//console.log(xhttp);
			 
			if(xhttp.status == 200){
				var searchFilesResp = JSON.parse(xhttp.responseText)
				//console.log(searchFilesResp);
	
				var documentCount  = searchFilesResp.respBody.docs.length;
				
				
				var searchTable = document.getElementById("searchTable");
				
				//searchTable.deleteRow(0); 
				
				while(searchTable.rows.length > 0) {
				  searchTable.deleteRow(0);
				}
				var row = searchTable.insertRow(0);
				row.innerHTML = '<td style="text-align:center;" colspan=7> <button class="addBtn" class="searchUserTile" onclick="'+"location.href='manageUser.html'"+'">Back</button></td>'
				if(documentCount == 0){
					var row = searchTable.insertRow(0);
					row.innerHTML = '<td style="text-align:center;" colspan=7>No Records Available</td>'
				
				}
				for (var i = 0; i < documentCount; i++) {
					
					var user = searchFilesResp.respBody.docs[i];
					
					var rowNumber = document.getElementById("searchTable").rows.length; 
					console.log(rowNumber);
					var row = searchTable.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					var cell5 = row.insertCell(4);
					var cell6 = row.insertCell(5);
					var cell7 = row.insertCell(6);
					cell1.innerHTML = user.firstName;
					cell2.innerHTML = user.middleName;
					cell3.innerHTML = user.lastName;
					cell4.innerHTML = user.userEmail;
					cell5.innerHTML = user.accType;
					//var imageUrl = searchFilesResp.respBody.fileDownloadContextUrl + '\\'+file._id +'\\'file.newFileName;
					/* cell4.innerHTML = ''file.newFileName; */
					//cell4.innerHTML = '<a href="#" onclick="downloadFiles();" title="My link title">'+file.newFileName+'</a>';
					cell6.innerHTML = '<a href=# onclick="return downloadFiles(\'' +searchFilesResp.respBody.fileDownloadContextUrl + '\',\''+ user._id +'\',\'' + user.profileImageName  +'\')">'+user.profileImageName+'</a>';
					cell7.innerHTML = '<button class="addBtn" onclick="return editUserInfo(\'' +user._id + '\',\''+ user._rev +'\')">'+"Edit"+'</button> &nbsp'+ '<button class="addBtn" onclick="return changeUserImage(\'' +user._id + '\',\''+ user._rev +'\')">'+"Change Image"+'</button>' ;
					//cell6.innerHTML = '<a href=# onclick="return editUserInfo(\'' +user._id  +'\')">'+"edit"+'</a>';
				}
				var header = searchTable.createTHead();
				var row = header.insertRow(0);
				var cell1 = row.insertCell(0);	
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				var cell5 = row.insertCell(4);
				var cell6 = row.insertCell(5);
				var cell7 = row.insertCell(6);
				cell1.innerHTML = "<b>First Name</b>";
				cell2.innerHTML = "<b>Middle Name</b>";
				cell3.innerHTML = "<b>Last Name</b>";
				cell4.innerHTML = "<b>Email Id</b>";
				cell5.innerHTML = "<b>Acc Type</b>";
				cell6.innerHTML = "<b>Profile</b>";
				cell7.innerHTML = "<b>Action</b>";
				row.style.backgroundColor = "black";
			}else{
				alert("Failed to fetch user details. Try again");
			} 
			
			
		} 
	};
	
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(requestJson));
	
	
}

function downloadFiles(fileDownloadContextUrl, id, fileName) {
	window.open(fileDownloadContextUrl+'/'+id+'/'+fileName);
}

function editUserInfo( id, rev) {
	
	console.log("within Search Users");
	var requestJson = {};
	requestJson._id = id;
	requestJson._rev = rev;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "api/fetchUserDetailById", true);
	xhttp.onreadystatechange = function(){
		 if(xhttp.readyState == 4){
			if(xhttp.status == 200){
				var editingUserInfo = JSON.parse(xhttp.responseText)
				var documentCount  = editingUserInfo.respBody.docs.length;
				
				for (var i = 0; i < documentCount; i++) {
					var user = editingUserInfo.respBody.docs[i];
					window.sessionStorage.setItem('firstName', user.firstName);
					window.sessionStorage.setItem('middleName', user.middleName);
					window.sessionStorage.setItem('lastName', user.lastName);
					window.sessionStorage.setItem('userEmail', user.userEmail);
					window.sessionStorage.setItem('accType', user.accType);
					window.sessionStorage.setItem('_id', user._id);
					window.sessionStorage.setItem('_rev', user._rev);
					window.sessionStorage.setItem('creationDate', user.creationDate);
					window.sessionStorage.setItem('originalFileName', user.originalFileName);
					window.sessionStorage.setItem('profileImageName', user.profileImageName);
				}
				window.location = "editUser.html";
			} 
		} 
	};
	
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(requestJson));
	
	
}

function changeUserImage( id, rev) {
	
	console.log("within Search Users");
	var requestJson = {};
	requestJson._id = id;
	requestJson._rev = rev;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "api/fetchUserDetailById", true);
	xhttp.onreadystatechange = function(){
		 if(xhttp.readyState == 4){
			if(xhttp.status == 200){
				var editingUserInfo = JSON.parse(xhttp.responseText)
				var documentCount  = editingUserInfo.respBody.docs.length;
				
				for (var i = 0; i < documentCount; i++) {
					var user = editingUserInfo.respBody.docs[i];
					window.sessionStorage.setItem('_id', user._id);
					window.sessionStorage.setItem('_rev', user._rev);
					window.sessionStorage.setItem('firstName', user.firstName);
					window.sessionStorage.setItem('lastName', user.lastName);
				}
				window.location = "changeImage.html";
			} 
		} 
	};
	
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(requestJson));
	
	
}

function updateUserInfo() {
	alert("Within updateUserInfo");
	if(document.getElementById('firstName').value == "" ){
		alert("First Name cannot be blank ");
		return false;
	}else if(document.getElementById('lastName').value == "" ){
		alert("Last Name cannot be blank ");
		return false;
	}else if(document.getElementById('accType').value == "" ){
		alert("Account Type cannot be blank ");
		return false;
	}else if(document.getElementById('userEmail').value == "" ){
		alert("User Email cannot be blank ");
		return false;
	}
	
	var data = {};
	data.firstName=document.getElementById('firstName').value;
	data.middleName=document.getElementById('middleName').value;
	data.lastName=document.getElementById('lastName').value;
	data.accType=document.getElementById('accType').value;
	data.userEmail=document.getElementById('userEmail').value;
	data._id=document.getElementById('_id').value;
	data._rev=document.getElementById('_rev').value;
	data.creationDate=document.getElementById('creationDate').value;
	data.originalFileName=document.getElementById('originalFileName').value;
	data.profileImageName=document.getElementById('profileImageName').value;
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/updateUserInfo", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			if(xhttp.status == 200){
				alert("User information updated successfully");
				window.location = "manageUser.html";
			}else{
				alert("Failed to add user information. Try again");
			}
		}
	};
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data)); 
	return false;
	
	
}

function updateImage(){
	if(document.getElementById("changeUserImage").files[0] == undefined ){
		alert("No image selected");
		return false;
	}
	
	var data = new FormData();
	data.append("_id",document.getElementById('_id').value);
	data.append("_rev",document.getElementById('_rev').value);
	data.append("firstName",document.getElementById('firstName').value);
	data.append("lastName",document.getElementById('lastName').value);
	data.append("changeUserImage", document.getElementById("changeUserImage").files[0]);
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/updateImage", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			if(xhttp.status == 200){
				document.forms['fileUploadForm'].reset()
				alert("User image updated successfully");
				window.location = "manageUser.html";
			}else{
				alert("Failed to update user Image. Try again");
			}
		}
	};
    xhttp.setRequestHeader("enctype", "multipart/form-data");
    xhttp.send(data); 
	return false;
}