// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require('./auth-middleware')
const authRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
authRouter.post("/register",checkPasswordLength,(req, res, next) =>{
const { username, password } =req.body
const hash= bcrypt.hashSync(password,8)
Users.add({username,password:hash})
.then((users) =>{
  res.json(users)
})
})


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
  authRouter.post("/login",async(req, res, next) =>{
try {
  const{ username, password}=req.body
  const [user] = await Users.findBy({username})
  const check = !user?false: bcrypt.compareSync(password,user.password)
  if(user&&check===true){
    req.session.user=user
res.json({message:`welcome ${user.username}`})
  }
  else{
res.status(401).json({message: "Invalid credentials"})
  }
} catch (error) {
  next(error)
}
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
  authRouter.get("/logout",(req, res, next) =>{
    if(req.session.user){
      

      req.session.destroy(err=>{ 
          if(err){res.json({message:"error"})}
          
          else{
            res.json({message:"logged out"})
          }
      })
  
    }
    else{
      res.json({message:"no session"})
  }
})

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports =authRouter;
