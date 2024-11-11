const recibeWebhok = (req,res)=>{
console.log(req.query)
res.send("webhok")
}

module.exports = {recibeWebhok}