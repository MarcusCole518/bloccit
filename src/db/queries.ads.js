const Advertisement = require("./models/").Advertisement;

module.exports = {

    getAllAds(callback){
        return Advertisement.all()
        .then((ads) => {
            callback(null, ads);
        })
        .catch((err) => {
            callback(err);
        })
    }
}