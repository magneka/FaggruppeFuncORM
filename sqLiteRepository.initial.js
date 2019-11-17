/* eslint-disable no-return-await */
exports.getRepositoryFactory = db => (fields, table) => {
  // ----------------------------------------------------------------------------------------
  // Fields lists
  // ----------------------------------------------------------------------------------------

  // getIdField
  // getNonIdFields
  // getAllFields

  // transform json object to array with fields in correct order for insert and update
  // getParmsInOrder

  // ----------------------------------------------------------------------------------------
  // Generators for SQL Statements
  // ----------------------------------------------------------------------------------------

  // getCreateStatement
  
  // getSelectStatement             - select a, b, .. from table
  // getSelectStatementById         - select a, b, .. from table where id = 1
  // getSelectStatementIn           - select a, b, .. from table where a in 1, 2, 3
  // getSelectStatementByFieldName  - select a, b, .. from table where b = 1
  // getInsertStatement             - insert into table (a, b, c) values (1, 2, 3)
  // getUpdateByIdStatement         - update table set b=1, c=2 where id = 1 
  // getDeleteByIdStatement         - delete from table where a = 1
  // getLastId                      - select rowid from table order by rowid desc limit 1
  
  // ----------------------------------------------------------------------------------------
  // DB driver calls
  // ----------------------------------------------------------------------------------------

  const dbRun = async (query, parameters) => new Promise((resolve, reject) => {
    db.run(query, parameters, (err, rows) => { if (err) reject(err); resolve(rows) })
  })

  const dbSingle = async (query, parameters) => new Promise((resolve, reject) => {
    db.get(query, parameters, (err, rows) => { if (err) reject(err); resolve(rows) })
  })

  const dbAll = async (query, parameters) => new Promise((resolve, reject) => {
    db.all(query, parameters, (err, rows) => { if (err) reject(err); resolve(rows) })
  })

  // run like this
  // const getAllCustomers = async () => await dbAll("SELECT * FROM Employee", []);

  // ----------------------------------------------------------------------------------------
  // Exported functions
  // ----------------------------------------------------------------------------------------

  // createTable
  // insert
  // selectAll
  // selectWherId
  // selectWherIn
  // selectWhereField 
  // updateById
  // deleteById 

  const logQueries = () => {
    console.log('==================================================================')
    console.log('fields', fields)
    console.log('tablename', table)
    // console.log('getIdField:', getIdField())
    // console.log('getNonIdFields:', getNonIdFields())
    // console.log('getSelectStatementByFieldName:', getSelectStatementByFieldName('LastName'))
    // console.log('getSelectStatementById:', getSelectStatementById())
    // console.log('getInsertStatement:', getInsertStatement())
    // console.log('getUpdateStatement:', getUpdateByIdStatement())
    // console.log('getDeleteStatementById:', getDeleteByIdStatement())
    // console.log('getCreateStatement:', getCreateStatement())
  }

  return {
    // selectAll: selectAll,
    // selectById: selectWherId,
    // selectWhereIn: selectWherIn,
    // selectByField: selectWhereField,
    // create: createTable,
    // insert: insert,
    // update: updateById,
    // delete: deleteById,
    displayQueries: logQueries,
    // dbRun: dbRun,
    // dbSingle: dbSingle,
    // dbAll: dbAll
  }
}
