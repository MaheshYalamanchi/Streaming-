
var jwt = require('jsonwebtoken');
var uuid = require('uuid-random');

const proctorDBURL = "mongodb+srv://microcertdevusr:MicroCertPass123@microcertcluster0.jsoli.mongodb.net/proctor?retryWrites=true&w=majority"
let generateProctorToken = async (req) => {
    try {
        let timeout = typeof req.timeout != 'undefined' ? req.timeout : 90
        let template = typeof req.template != 'undefined' ? req.template : "default"
        let user = {"assessmentId": req.assessmentId,"username": req.username,"nickname": req.nickname, "template": template,"subject":req.subject,"timeout":timeout}
        if (!req.roomId){
            user.id = uuid()
        }else{
            user.id = req.roomId
        }
        user.tags = [req.nickname,req.assessmentId, req.taskId];
        user.taskId = req.taskId
        user.nickname = req.nickname.replace(/\s/g, "");
        user.requestType = req.requestType
        var secret = 'eime6Daeb2xanienojaefoh4';
        let tokenArg = {
            nickname : user.username,
            id : user.id,
            tags : user.tags,
            username : user.nickname,
            template : user.template,
            subject : user.subject,
            timeout : user.timeout
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
       // console.log("user.proctorToken",user.proctorToken)

     
        if (user.proctorToken){
            return  user.proctorToken;
        }else{
            return 'Error While Generating Token!';
        }
    } catch (err) {
        return err;
    }
};

let getNewChatMessagesV2 = async (req) => {
    try {
        const MongoClient = require('mongodb').MongoClient;
        const proctorSchemaDBUrl = process.env.proctorSchemaDBUrl || proctorDBURL
        let Connection = await  MongoClient.connect(proctorSchemaDBUrl).catch(err => { console.log(err); });
        var dbo = await Connection.db('proctor');
        let queryJSON = [   
            // {$match : {_id : "da68a2e0-52b6-4a40-bb25-e3babe1e0eee"}},
            {$match : {status : "started"}},
            {$sort: { _id: -1 }},
            
            {$lookup : {
                from: "chats",
                let: { status: "$status",subject:"$subject",student:"$student" ,room:"$_id"},
                pipeline: [
                    { $match: { $and: [{ $expr: { $eq: ["$room", "$$room"] } },{ $expr: { $eq: ["$type", "message"] } } , 
                    { "$expr": { "$ne": ["$user", "admin"] } }] } },
                    {$project:{_id:0,message:1,user:1,createdAt:1}}
                ],
                as: "chatDetail"    
            }},
            { $unwind: "$chatDetail" },
            {$project : {
                _id:1,
                createdAt:{ $dateToString: { format: "%Y-%m-%d %H:%M", date: "$chatDetail.createdAt"} },
                status : 1,
                subject :1,
                incidents:1,
                student:1,
                message:"$chatDetail.message"
            }},
            {$sort: { createdAt: -1 }},
        ];
        let getDataObj = await dbo.collection("rooms").aggregate(queryJSON).toArray();
        if(getDataObj && getDataObj.length>=1){
            return getDataObj
        }else{
            return []
        }
    } catch (err) {
        return err;
    }
};

let getCandidateMessageCount = async (req) => {
    try {
        const MongoClient = require('mongodb').MongoClient;
        const proctorSchemaDBUrl = process.env.proctorSchemaDBUrl || proctorDBURL
        let Connection = await  MongoClient.connect(proctorSchemaDBUrl).catch(err => { console.log(err); });
        var dbo = await Connection.db('proctor');
        let queryJSON = [   
            {$match : {_id : req.room}},
            // {$match : {status : "started"}},
            {$sort: { _id: -1 }},          
            {$project : {
                _id:0,
                incidents:1
            }}
        ];
        let getDataObj = await dbo.collection("rooms").aggregate(queryJSON).toArray();
        if(getDataObj && getDataObj.length>=1){
            return getDataObj[0].incidents
        }else{
            return 0
        }
    } catch (err) {
        return err;
    }
};

let findPhoneObjectDetection = async (req) => {
    try {
        const MongoClient = require('mongodb').MongoClient;
        const proctorSchemaDBUrl = process.env.proctorSchemaDBUrl || proctorDBURL
        let Connection = await  MongoClient.connect(proctorSchemaDBUrl).catch(err => { console.log(err); });
        var dbo = await Connection.db('proctor');
        let queryJSON = [   
            {$match : {user : req.user}},
            {$sort: { _id: -1 }},    
            {$group: { _id: "null", "object" : {"$addToSet": "$metadata.objectnew"} } }, 
            {$project : {
                _id:0,
                object:1
            }}
        ];
        let getDataObj = await dbo.collection("attaches").aggregate(queryJSON).toArray();
        if( getDataObj && getDataObj[0] && getDataObj[0].object.length>=1){
            let retext = ""
            getDataObj.map(mainele=>{
                mainele.object.map(element=>{
                    var splitelement = element.split(',')
                    splitelement.map(subele=>{
                        if(subele === 'phone'){
                            retext=subele
                        }
                    });
                });
            })
            return retext
        }else{
            return ""
        }       
    } catch (err) {
        return err;
    }
};

let getObjectDetectionData = async (req) => {
    try {
        const MongoClient = require('mongodb').MongoClient;
        const proctorSchemaDBUrl = process.env.proctorSchemaDBUrl || proctorDBURL
        let Connection = await  MongoClient.connect(proctorSchemaDBUrl).catch(err => { console.log(err); });
        var dbo = await Connection.db('proctor');
        let queryJSON = [   
            {$match: { "metadata.objectnew": { "$exists": true } } },
            {$match : {"metadata.objectnew":{$ne:""}}},
            {$sort: { _id: -1 }},
            {$group: { _id: "$user", createdAt:{$first: "$createdAt"},"object" : {"$addToSet": "$metadata.objectnew"} } }, 
            {$project : {
                _id:1,
                object:1,
                createdAt:1,
            }},
            {$lookup : {
                from: "rooms",
                let: { student:"$_id"},
                pipeline: [
                    { $match: { $expr: { $eq: ["$student", "$$student"] } }},
                    {$project:{_id:1,user:1,subject:1}}
                ],
                as: "roomDetail"    
            }},
            {$unwind: "$roomDetail" },
            {$project : {
                _id:0,
                user:"$_id",
                object:1,    
                room:"$roomDetail._id",
                subject:"$roomDetail.subject",
                createdAt:"$createdAt"
            }}
        ];
        let getDataObj = await dbo.collection("attaches").aggregate(queryJSON).toArray();
        if( getDataObj && getDataObj[0] && getDataObj[0].object.length>=1){
            let phoneArray = []
            getDataObj.map(mainele=>{
                let retext = "";
                mainele.object.map(element=>{
                    var splitelement = element.split(',')
                    splitelement.map(subele=>{
                        if(subele === 'phone'){
                            retext=subele
                        }
                    });
                });
                mainele.objectText = retext
                if(retext){
                    phoneArray.push(mainele)
                }

            });
            return phoneArray;
        }else{
            return [];
        }       
    } catch (err) {
        return err;
    }
};

module.exports = {
    generateProctorToken,
    getNewChatMessagesV2,
    getCandidateMessageCount,
    findPhoneObjectDetection,
    getObjectDetectionData
}

