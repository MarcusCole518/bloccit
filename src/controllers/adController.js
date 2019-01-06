const adQueries = require("../db/queries.ads.js");

module.exports = {
    index(req, res, next){
        adQueries.getAllAds((err, advertisements) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("advertisements/index", {advertisements});
            }
        })
    }
}