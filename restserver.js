const sqlite3 = require('sqlite3').verbose()
const myDb = require('./sqLiteRepository.js')
const genCtrlr = require('./controllers/genericController')
const empRepo = require('./repositories/empRepo')
const cpRepo = require('./repositories/companyRepo')

// For receiving JSON in posts
const express = require('express')
const bodyParser = require('body-parser')

// Setting up the database
const dbFileName = './demodb03.db'
const db = new sqlite3.Database(dbFileName)
const repositoryFactory = myDb.getRepositoryFactory(db)
const employeeRepository = empRepo.createRepository(repositoryFactory)
const companyReposoitory = cpRepo.createRepository(repositoryFactory)

// Setting up express
const app = express()
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: false }))

// Serve static files
app.use(express.static('wwwroot'))

// Setting up controllers
// require('./controllers/employeeController')(app, employeeRepository)
// require('./controllers/companyController')(app, companyReposoitory, '/api/company')

genCtrlr.restController(app, companyReposoitory, '/api/company')
genCtrlr.restController(app, employeeRepository, '/api/employee')

app.listen(3000)
