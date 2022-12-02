"use strict";

class RequestService {
    //Constructor 
    RequestService() {}

    reqHelper(req) {
        let colour;
        if (req.session && req.session.colour) {
            colour = req.session.colour;
        }

        if (req.isAuthenticated()) {
            return{
                authenticated: true,
                username: req.user.username,
                colour: colour,
            };
        }
        else {
            return { authenticated: false, colour: colour };
        }
    }
}

module.exports = new RequestService();