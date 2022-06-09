module.exports = async (req,res,next) => {
  const token = req.headers.authorization;
  const TOKEN_EXTERNAL = process.env.TOKEN_EXTERNAL;
  if(token === TOKEN_EXTERNAL){
    return next();
  }
  return res.status(403).json({message: 'Not Authorized'})
}