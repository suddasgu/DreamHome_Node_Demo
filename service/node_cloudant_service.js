var express  = require('express');
var request = require('request'); 

//Cloudant documents
var userProfiles = require("../dao/user-profiles").db;




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


