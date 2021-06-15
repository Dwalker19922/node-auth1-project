const dbConfig = require('../../data/db-config')
const db=require('../../data/db-config')
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
const rows = db("users")
.select("user_id","username")
return rows
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db("users").where(filter)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db("users").where("user_id",user_id).select("user_id","username")
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
const rows = db("users")
.insert(user)
const [id] = await rows
const [returnData] = await findById(id)

return returnData
}
module.exports ={
  find,
  findBy,
  findById,
  add
}
// Don't forget to add these to the `exports` object so they can be required in other modules
