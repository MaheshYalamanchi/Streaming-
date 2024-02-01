const invoke = require("./lib/http/invoke");
let roomData = async (req) => {
    var jsonData = {
        authorization: req.headers.authorization
    }
    if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.subject){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[subject]="+req.query.sort.subject+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.student){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[student]="+req.query.sort.student+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.startedAt){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[startedAt]="+req.query.sort.startedAt+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.duration){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[duration]="+req.query.sort.duration+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.score){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[score]="+req.query.sort.score+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.status){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[status]="+req.query.sort.status+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.error){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[error]="+req.query.sort.error+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.incidents){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[incidents]="+req.query.sort.incidents+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.proctor){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[proctor]="+req.query.sort.proctor+"",jsonData)
        return responseData;
    }
}
let roomSearch = async (req) => {
    var jsonData = {
        authorization: req.headers.authorization
    }
    if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.subject){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[subject]="+req.query.sort.subject+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.student){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[student]="+req.query.sort.student+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.startedAt){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[startedAt]="+req.query.sort.startedAt+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.duration){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[duration]="+req.query.sort.duration+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.score){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[score]="+req.query.sort.score+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.status){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[status]="+req.query.sort.status+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.error){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[error]="+req.query.sort.error+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.incidents){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[incidents]="+req.query.sort.incidents+"",jsonData)
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.proctor){
        let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[proctor]="+req.query.sort.proctor+"",jsonData)
        return responseData;
    }
}
let userData = async(req)=>{
    if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.nickname){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[nickname]=" + req.query.sort.nickname + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.id){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[id]=" + req.query.sort.id + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.role){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[role]=" + req.query.sort.role + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.loggedAt){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[loggedAt]=" + req.query.sort.loggedAt + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.rating){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[rating]=" + req.query.sort.rating + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.locked){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[locked]=" + req.query.sort.locked + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.face){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[face]=" + req.query.sort.face + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.passport){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[passport]=" + req.query.sort.passport + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.similar){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[similar]=" + req.query.sort.similar + "");
        return responseData;
    } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.verified){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[verified]=" + req.query.sort.verified + "");
        return responseData;
    }
};
let userSearch = async(req)=>{
    if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.nickname){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[nickname]=" + req.query.sort.nickname + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.id){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[id]=" + req.query.sort.id + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.role){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[role]=" + req.query.sort.role + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.loggedAt){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[loggedAt]=" + req.query.sort.loggedAt + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.rating){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[rating]=" + req.query.sort.rating + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.locked){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[locked]=" + req.query.sort.locked + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.face){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[face]=" + req.query.sort.face + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.passport){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[passport]=" + req.query.sort.passport + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.similar){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[similar]=" + req.query.sort.similar + "");
        return responseData;
    } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.verified){
        let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "&sort[verified]=" + req.query.sort.verified + "");
        return responseData;
    }
};
module.exports = {
    roomData,
    roomSearch,
    userData,
    userSearch
}