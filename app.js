const express = require('express')
const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const filePath = path.join(__dirname, 'cricketTeam.db')

let db
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log(`server running....`)
    })
  } catch (e) {
    console.log(`db.error:${e.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

//api-1
app.get('/players/', async (request, response) => {
  const query = `
    SELECT 
        *
    FROM 
        cricket_team`
  const result = await db.all(query)
  response.send(
    result.map(eachplayer => {
      return {
        playeId: eachplayer.player_id,
        playerName: eachplayer.player_name,
        jerseyNumber: eachplayer.jersey_number,
        role: eachplayer.role,
      }
    }),
  )
})

//api-2
app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const query = `
  INSERT INTO 
    cricket_team(player_name,jersey_number,role)
  VALUES(
    '${playerName}',
     ${jerseyNumber},
    '${role}'
  )`
  await db.run(query)
  response.send(`Player Added to Team`)
})

//api-3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `
    SELECT 
        *
    FROM 
        cricket_team
    WHERE 
      player_id=${playerId}`
  const result = await db.get(query)
  response.send({
    playeId: result.player_id,
    playerName: result.player_name,
    jerseyNumber: result.jersey_number,
    role: result.role,
  })
})

//api-4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body
  const query = `
  UPDATE cricket_team
  SET 
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}'
  WHERE 
    player_id=${playerId}`
  await db.run(query)
  response.send(`Player Details Updated`)
})

//api-5
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  console.log(playerId)
  const query = `
  DELETE FROM 
    cricket_team
  WHERE 
    player_id=${playerId}`
  await db.run(query)
  response.send(`Player Removed`)
})

module.exports = app
