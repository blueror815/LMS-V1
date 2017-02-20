/**
 *
 * Cluster Model
 * field: id, cluster_name, cluster_description, game_score, game_description, traction_score, 
 * traction_description, maturity_score, maturity_description, intensity_score,intensity_description
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClusterSchema = new Schema({
    name: { type: String },
    description: { type: String },
    game_score: { type: Number },
    game_summary: { type: String },
    traction_score: { type: Number },
    traction_description: { type: String },
    maturity_score: { type: Number },
    maturity_description: { type: String },
    intensity_score: { type: Number },
    intensity_description: { type: String },
    order: { type: Number },
    color_hex: { type: String }
});

module.exports = mongoose.model('Cluster', ClusterSchema);