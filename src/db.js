const mongoose = require('mongoose')

;(async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('MongoDB connected to', db.connection.host)
  } catch (err) {
    console.log(err)
  }
})()
