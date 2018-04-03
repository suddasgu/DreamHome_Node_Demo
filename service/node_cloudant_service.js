var express  = require('express');
var request = require('request'); 
var multer = require ('multer');
var fs = require('fs');
var moment = require('moment');

//Cloudant documents
var userProfiles = require("../dao/user-profiles").db;
var fileupload = require("../dao/dhfi_references").db;
var dhfi_users = require("../dao/dhfi_users").db;




//Adding user profile
exports.addUserProfile = function(res, details, callback){
	
	console.log(details);
	var id="";
	userProfiles.insert(details, id, function(err, doc) {
        if (err) {
			console.log("==========ERROR=========");
            console.log(err);
            populateErrorResponse(500,"Failed to add User profile information", function(resp){
				callback(resp);
			});
        } else{
			console.log("==========Success=========");
			populateSuccessResponse(doc,"Successfully added User profile", function(resp){
				callback(resp);
			});
		}
    });
}

exports.fetchUserProfiles = function(res, callback){
	
	userProfiles.list({include_docs: true}, function(err, data) {
		if (err) {
			console.log("==========ERROR=========");
            console.log(err);
            populateErrorResponse(500,"Failed to fetch User Profiles", function(resp){
				callback(resp);
			});
        } else{
			console.log("==========Success=========");
			populateSuccessResponse(data,"Successfully fetched user profiles", function(resp){
				callback(resp);
			});
		}
	});
}

exports.uploadFile = function(res, fileDetails, body, callback){
	var id="";
	var details = {};
	details.title = body.title;
	details.description = body.description;
	details.fileToUpload = body.fileToUpload;
	details.creationDate = moment(new Date().toISOString()).format('DD-MMM-YYYY HH:mm:ss');
	details.originalFileName = fileDetails.originalname;
	
	var arr = fileDetails.originalname.split(".");
	var fileExt = arr[arr.length-1];
	details.newFileName = moment(new Date().toISOString()).format('YYYYMMDDHHmmss')+'.'+fileExt;
	  fileupload.insert(details, id, function(err, doc) {
        if (err) {
			console.log("==========ERROR=========");
            console.log(err);
            populateErrorResponse(500,"Failed to add User profile information", function(resp){
				callback(resp);
			});
        } else{
			fs.readFile(fileDetails.path, function (err, dataObj) {
				var url = fileupload.config.url;
				url += "/dhfi_references/" + doc.id;
				url += "/" + encodeURIComponent(details.newFileName);
				url += "?rev=" + doc.rev;

				var headers = {
					'Content-Type': fileDetails.mimetype,
					'Content-Length': fileDetails.size
				};

				var requestOptions = {
					url: url,
					headers: headers,
					body: dataObj
				};

				request.put(requestOptions, function(err, response, body) {
					if (err) {
						populateErrorResponse(500,"Failed to Upload Attachment", function(resp){
							callback(resp);
						});
					}
					else {
						console.log("==========Success file uploaded=========");
						populateSuccessResponse(doc,"Successfully added User profile", function(resp){
							console.log(doc);
							callback(resp);
						});
					}
				});
			});
		}
    });   
}


//Adding user profile
exports.searchFiles = function(res, details, callback){
	
	var title = details.title;
	var cloudantquery = {
			"selector": {
			  "$or": [
						  { "title": { "$regex": title }},
						  { "description":  { "$regex": title }}
						]
			}
	  };

	  request({
			method: 'POST', 
			uri: fileupload.config.url+'/dhfi_references/_find', 
			json: true, 
			body: cloudantquery
	  }, function (error, response, body) {
		  console.log(body);
			if (!error && response.statusCode == 200) {
				body.fileDownloadContextUrl = fileupload.config.url+'/dhfi_references';
				populateSuccessResponse(body,"Successfully fetched documents", function(resp){
					callback(resp);
				});
			}else{
				populateErrorResponse(500,"Failed fetch Attachments", function(resp){
					callback(resp);
				});
			}
	  });
}


exports.addUserInfo = function(res, fileDetails, body, callback){
	var id="";
	var details = {};
	details.firstName = body.firstName;
	details.middleName = body.middleName;
	details.lastName = body.lastName;
	details.accType = body.accType;
	details.userEmail = body.userEmail;
	details.creationDate = moment(new Date().toISOString()).format('DD-MMM-YYYY HH:mm:ss');
	details.originalFileName = fileDetails.originalname;
	
	var arr = fileDetails.originalname.split(".");
	var fileExt = arr[arr.length-1];
	if (fileExt=="jpg" || fileExt=="jpeg" || fileExt=="png"|| fileExt=="PNG"){
		
		details.profileImageName = details.firstName+'_'+details.lastName+'.'+fileExt;
		  dhfi_users.insert(details, id, function(err, doc) {
			if (err) {
				console.log("==========ERROR=========");
				console.log(err);
				populateErrorResponse(500,"Failed to add User profile information", function(resp){
					callback(resp);
				});
			} else{
				fs.readFile(fileDetails.path, function (err, dataObj) {
					var url = dhfi_users.config.url;
					url += "/dhfi_users/" + doc.id;
					url += "/" + encodeURIComponent(details.profileImageName);
					url += "?rev=" + doc.rev;

					var headers = {
						'Content-Type': fileDetails.mimetype,
						'Content-Length': fileDetails.size
					};

					var requestOptions = {
						url: url,
						headers: headers,
						body: dataObj
					};

					request.put(requestOptions, function(err, response, body) {
						if (err) {
							populateErrorResponse(500,"Failed to Upload Attachment", function(resp){
								callback(resp);
							});
						}
						else {
							console.log("==========Success file uploaded=========");
							populateSuccessResponse(doc,"Successfully added User profile", function(resp){
								console.log(doc);
								callback(resp);
							});
						}
					});
				});
			}
		}); 
    } else{
		
		populateErrorResponse(500,"Only jpg/jpeg and png files are allowed!", function(resp){
				callback(resp);
		});
	}  
}

exports.searchUsers = function(res, details, callback){
	
	var userName = details.userName;
	var emailId = details.emailId;
	var cloudantquery = {
			"selector": {}
	  };
	if(details.userName != "" && details.emailId != ""){
		cloudantquery = {
			"selector": {
				"userEmail" : emailId,
				"$or": [
						  { "firstName": { "$regex": userName }},
						  { "middleName": { "$regex": userName }},
						  { "lastName":  { "$regex": userName }}
						]
			}
	  };
	}else if(details.userName != ""){
		cloudantquery = {
			"selector": {
				"$or": [
						  { "firstName": { "$regex": userName }},
						  { "middleName": { "$regex": userName }},
						  { "lastName":  { "$regex": userName }}
						]
			}
	  };
	}else if(details.emailId != ""){
		cloudantquery = {
			"selector": {
				"userEmail" : emailId
			}
	  };
	}
	
console.log("Searching for users: "+JSON.stringify(cloudantquery));
	  request({
			method: 'POST', 
			uri: dhfi_users.config.url+'/dhfi_users/_find', 
			json: true, 
			body: cloudantquery
	  }, function (error, response, body) {
		  console.log(body);
			if (!error && response.statusCode == 200) {
				body.fileDownloadContextUrl = dhfi_users.config.url+'/dhfi_users';
				populateSuccessResponse(body,"Successfully fetched Userinfo", function(resp){
					callback(resp);
				});
			}else{
				populateErrorResponse(500,"Failed fetch User information", function(resp){
					callback(resp);
				});
			}
	  });
}


exports.fetchUserDetailById = function(res, details, callback){
	
	var _id = details._id;
	var _rev = details._rev;
	var cloudantquery = {
			"selector": {
				"_id" 	: _id,
				"_rev" 	: _rev
			}
	  };
	
console.log("Searching for users: "+JSON.stringify(cloudantquery));
	  request({
			method: 'POST', 
			uri: dhfi_users.config.url+'/dhfi_users/_find', 
			json: true, 
			body: cloudantquery
	  }, function (error, response, body) {
		  console.log(body);
			if (!error && response.statusCode == 200) {
				body.fileDownloadContextUrl = dhfi_users.config.url+'/dhfi_users';
				populateSuccessResponse(body,"Successfully fetched Userinfo", function(resp){
					callback(resp);
				});
			}else{
				populateErrorResponse(500,"Failed fetch User information", function(resp){
					callback(resp);
				});
			}
	  });
}

exports.updateUserInfo = function(res, reqBody, callback){

	var _id = reqBody._id;
	var _rev = reqBody._rev;
	var cloudantquery = {
			"selector": {
				"_id" 	: _id,
				"_rev" 	: _rev
			}
	  };
	
console.log("fetching before updating users: "+JSON.stringify(cloudantquery));
	  request({
			method: 'POST', 
			uri: dhfi_users.config.url+'/dhfi_users/_find', 
			json: true, 
			body: cloudantquery
	  }, function (error, response, body) {
		  console.log(body);
			if (!error && response.statusCode == 200) {
				var details = body.docs[0];
				
				
				details.firstName = reqBody.firstName;
				details.middleName = reqBody.middleName;
				details.lastName = reqBody.lastName;
				details.accType = reqBody.accType;
				details.userEmail = reqBody.userEmail;
				details._id = reqBody._id;
				details._rev = reqBody._rev;
				details.creationDate = reqBody.creationDate;
				details.originalFileName = reqBody.originalFileName;
				details.profileImageName = reqBody.profileImageName;
				
				dhfi_users.insert(details, function(err, doc) {
						if (err) {
							console.log("==========ERROR=========");
							console.log(err);
							populateErrorResponse(500,"Failed to add User profile information", function(resp){
								callback(resp);
							});
						} else{
							console.log("=======================Updated Doc===================");
							console.log(doc);
							populateSuccessResponse(doc,"Successfully fetched Userinfo", function(resp){
								callback(resp);
							});
						}
					});
			}else{
				populateErrorResponse(500,"Failed fetch User information", function(resp){
					callback(resp);
				});
			}
	  });
}


exports.updateImage = function(res, fileDetails, body, callback){
	
	var arr = fileDetails.originalname.split(".");
	var fileExt = arr[arr.length-1];
	if (fileExt=="jpg" || fileExt=="jpeg" || fileExt=="png"|| fileExt=="PNG"){
		
		var profileImageName = body.firstName+'_'+body.lastName+'.'+fileExt;
		 
		fs.readFile(fileDetails.path, function (err, dataObj) {
					var url = dhfi_users.config.url;
					url += "/dhfi_users/" + body._id;
					url += "/" + encodeURIComponent(profileImageName);
					url += "?rev=" + body._rev;

					var headers = {
						'Content-Type': fileDetails.mimetype,
						'Content-Length': fileDetails.size
					};

					var requestOptions = {
						url: url,
						headers: headers,
						body: dataObj
					};

					request.put(requestOptions, function(err, response, body) {
						if (err) {
							populateErrorResponse(500,"Failed to Upload Attachment", function(resp){
								callback(resp);
							});
						}
						else {
							console.log("==========Success file uploaded=========");
							populateSuccessResponse(body,"Successfully added User profile", function(resp){
								console.log(body);
								callback(resp);
							});
						}
					});
				});
		
    } else{
		
		populateErrorResponse(500,"Only jpg/jpeg and png files are allowed!", function(resp){
				callback(resp);
		});
	}  
}


function populateSuccessResponse(body, message, callback){
	var successResp={};
	successResp.status= 200;
	successResp.message= message;
	successResp.respBody = body;
	callback(successResp);
}

function populateErrorResponse(statusCode, message, callback){
	var faliureResp={};
	faliureResp.status= statusCode;
	faliureResp.message= message;
	callback(faliureResp);
}


