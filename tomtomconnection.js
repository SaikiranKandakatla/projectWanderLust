let axios=require("axios");
const maptoken="iPY018nOi5DAagPrF6vwihaseBKXwPac";
let urll=`https://api.tomtom.com/search/2/geocode/?key=${maptoken}&limit=2`;




async function fetch(p){
    urll=urll.replace(`/geocode/`,`/geocode/${encodeURIComponent(p)}.json`)
    try{
        let response=await axios.get(urll);
        return response.data.results[0].position;
    }catch(err){
        console.log(err)
    }
    }
async function Main(p){
    let coordinates=await fetch(p)
    return coordinates;
}
// Main();


module.exports.fetch=Main(p);


