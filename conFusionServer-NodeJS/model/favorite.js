const mongoose = require('mongoose');
const schema = mongoose.Schema;

var favoriteSchema = new schema({
    user:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    dishes:[{
        type:schema.Types.ObjectId,
        ref:'Dish'
    }]
},
{
    timestamps:true
});

const Favorites = mongoose.model("Favorites",favoriteSchema);

module.exports = Favorites;