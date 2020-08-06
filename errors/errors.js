exports.invalidPaths = (req, res, next) => {
    res.status(404).send({ msg: "Whoops, invalid path!" });
  };
  
exports.Error405 = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method!" });
};

exports.Error400 = (err,req,res,next) => {
  if (err.code === '22P02') res.status(400).send({msg: "Whoops, invalid request"})
  else if (err.code === '23503') res.status(400).send({msg:"Whoops, invalid user!"})
  else if (err.code === '42703') res.status(400).send({msg:"Whoops, undefined column!"})
  else if (err.code === '42803') res.status(400).send({msg:"Whoops, invalid filter value!"})
  else if (err.status === 400 ) res.status(400).send(err)
  else next(err)
}

exports.Error404 = (err,req,res,next) => {
  if (err.status === 404) {
    res.status(404).send(err)
  }
  else next(err)
}

exports.Error500 = (err,req,res,next) => {
  console.log(err)
  res.status(500).send({msg: "Server error!"})
}
  