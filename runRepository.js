const sqlite3 = require('sqlite3').verbose()
const myDb = require('./sqLiteRepository.js');

(async () => {
  const employeeDef = {
    tableName: 'Employee',
    fields:
        [
          { fieldName: 'Id', dataType: 'Integer' },
          { fieldName: 'FirstName', dataType: 'Varchar(50)' },
          { fieldName: 'LastName', dataType: 'Varchar(50)' },
          { fieldName: 'CompanyId', dataType: 'Integer' }
        ]
  }

  const CompanyDef = {
    tableName: 'Company',
    fields:
        [
          { fieldName: 'Id', dataType: 'Integer' },
          { fieldName: 'CompanyName', dataType: 'Varchar(50)' }
        ]
  }

  var dbFileName = '/Users/magnealvheim/Documents/Source/FagGruppe221019/FaggruppeFuncORM/FagGruppe.db'
  let db = new sqlite3.Database(dbFileName)

  let repositoryFactory = myDb.getRepositoryFactory(db)
  let employeeRepository = repositoryFactory(employeeDef.fields, employeeDef.tableName)
  let companyRepository = repositoryFactory(CompanyDef.fields, CompanyDef.tableName)
  companyRepository.displayQueries()
  employeeRepository.displayQueries()

  // Create tables
  await companyRepository.create()
  await employeeRepository.create()

  // Insert
  let newCompany = await companyRepository.insert({ CompanyName: 'Sotra Tepperens og VideoUtleie' })

  let newEmpA1 = await employeeRepository.insert({ Id: 10, CompanyId: newCompany.Id })
  console.log(`newEmp01 created: `, newEmpA1)
  
  // Test update
  let newEmpA2 = await employeeRepository.selectById(newEmpA1.Id)
   console.log(`newEmpR retrieved: `, newEmpA2)
  await employeeRepository.update({ ...newEmpA1, FirstName: 'Sherlock', LastName: 'Holmes' })
  let newEmpA3 = await employeeRepository.selectById(newEmpA1.Id)
  console.log(`newEmpR2 updated: `, newEmpA3)

  // Test delete
  await employeeRepository.delete(newEmpA1.Id)
  let deletedEmp = await employeeRepository.selectById(newEmpA1.Id)
  if (deletedEmp === undefined) console.log(`Record Id ${newEmpA1.Id} no longer exists..`)

  // Test select where in list
  let inItems = await employeeRepository.selectWhereIn([1, 2, 54, 55, 56])
  console.log(`inItems: `, inItems)

  console.log('And were done!')
})().catch(e => {
  console.log('Error', e)
})
