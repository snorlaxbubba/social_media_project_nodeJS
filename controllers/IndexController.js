const RequstService = require("../services/RequestService");

exports.Index = async function(req, res) {
    let reqInfo = RequstService.reqHelper(req);

    return res.render("index", { reqInfo: reqInfo });
}