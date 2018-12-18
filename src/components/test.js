const axios = require('axios')

function test() {
    var url = "https://responsa-na.herokuapp.com/api/sana/category"
    axios.get(url).then(res => {
        console.log("function: " + res)
        return res
    })
}


var test1 = test()
console.log("a: " + JSON.stringify(test1))
console.log(test1 == null)
console.log("finsish")

while (test1 == null) {
    console.log(test1)
}