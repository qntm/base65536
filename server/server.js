import express from 'express'

const app = express()
app.use(express.static('.'))
app.listen(3000, () => {
  console.log('listening')
})
