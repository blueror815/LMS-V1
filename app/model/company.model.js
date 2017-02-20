/**
 *
 * Company Model
 * field: id, cluster, country, name, description, companyId, twitterhandle, website, cluster_feature
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    cluster: { type: String },
    country: { type: String },
    name: { type: String },
    description: { type: String },
    companyId: { type: Number },
    twitterhandle: { type: String },
    website: { type: String },
    cluster_feature: { type: Boolean }
});

module.exports = mongoose.model('Company', CompanySchema);