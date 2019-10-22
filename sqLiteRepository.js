/* eslint-disable no-return-await */
exports.getRepositoryFactory = db => (fields, table) => {
  // ----------------------------------------------------------------------------------------
  // Fields lists
  // ----------------------------------------------------------------------------------------

  // getIdField
  const getIdField = () => fields.map((f) => f.fieldName).shift()
  // getNonIdFields
  const getNonIdFields = () => fields.map((f) => f.fieldName).slice(1)
  // getAllFields
  const getAllFields = () => fields.map((f) => f.fieldName)

  // transform json object to array with fields in correct order for insert and update
  // getParmsInOrder
  const getParmsInOrder = (jsonObj, forUpdate = false) => {
      const validFieldNames = getNonIdFields(fields)
  
      let paramArr = validFieldNames.reduce(
        (res, fieldname) => {
          if (jsonObj.hasOwnProperty(fieldname)) 
            res.push(jsonObj[fieldname])
          else 
            res.push(null)
          return res
        }
      , [])
  
      if (forUpdate) {
        paramArr.push(jsonObj[getIdField()])
      }
  
      return paramArr
    }

  // ----------------------------------------------------------------------------------------
  // Generators for SQL Statements
  // ----------------------------------------------------------------------------------------

  // getCreateStatement
  const getCreateStatement = () => fields.reduce((res, x, i) => {
      if (i === 0) {
        return `${res}${x.fieldName} integer primary key`
      } else if (i !== fields.length - 1) {
        return `${res}, ${x.fieldName} ${x.dataType}`
      } else {
        return `${res}, ${x.fieldName} ${x.dataType})`
      }
    }, [`CREATE TABLE IF NOT EXISTS ${table} (`])
  
  // getSelectStatement             - select a, b, .. from table
  const getSelectStatement = () => `SELECT ${getAllFields().join(', ')} FROM ${table}`
  // getSelectStatementById         - select a, b, .. from table where id = 1
  const getSelectStatementById = () => `${getSelectStatement()} WHERE ${getIdField()} = ?`
  // getSelectStatementIn           - select a, b, .. from table where a in 1, 2, 3
  const getSelectStatementIn = (parm) => `${getSelectStatement()} WHERE ${getIdField()} in (${parm.map(() => '?').join(', ')})`
  // getSelectStatementByFieldName  - select a, b, .. from table where b = 1
  const getSelectStatementByFieldName = (searchBy) => `${getSelectStatement()} WHERE ${searchBy} = ?`
  // getInsertStatement             - insert into table (a, b, c) values (1, 2, 3)
  const getInsertStatement = () => `INSERT INTO ${table} (${getNonIdFields().join(', ')}) VALUES (` + getNonIdFields().map(() => '?').join(', ') + ')'
  // getUpdateByIdStatement         - update table set b=1, c=2 where id = 1 
  const getUpdateByIdStatement = () => `UPDATE ${table} SET ${getNonIdFields().map((f) => f + ' = ?').join(', ')}  WHERE ${getIdField()} = ?`
  // getDeleteByIdStatement         - delete from table where a = 1
  const getDeleteByIdStatement = () => `DELETE FROM ${table} WHERE ${getIdField()} = ?`
  // getLastId                      - select rowid from table order by rowid desc limit 1
  const getLastId = () => `SELECT rowid from ${table} order by ROWID DESC limit 1`
  
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
  const createTable = async () => await dbRun(getCreateStatement(), [])
  // insert
  const insert = async (jsonObj) => { 
    await dbSingle(getInsertStatement(), getParmsInOrder(jsonObj)); 
    let newId = await dbSingle(getLastId()); 
    return { ...jsonObj, [getIdField()]: newId.Id } }
  // selectAll
  const selectAll = async () => await dbAll(getSelectStatement(), [])
  // selectWherId
  const selectWherId = async (id) => await dbSingle(getSelectStatementById(), [id])
  // selectWherIn
  const selectWherIn = async (parm) => await dbAll(getSelectStatementIn(parm), parm)
  // selectWhereField 
  const selectWhereField = async (field, parm) => await dbAll(getSelectStatementByFieldName(field), parm)
  // updateById
  const updateById = async (jsonObj) => dbRun(await getUpdateByIdStatement(), getParmsInOrder(jsonObj, true))
  // deleteById 
  const deleteById = async (id) => dbRun(await getDeleteByIdStatement(), [id])

  const logQueries = () => {
    console.log('==================================================================')
    console.log('fields', fields)
    console.log('tablename', table)
    console.log('getIdField:', getIdField())
    console.log('getNonIdFields:', getNonIdFields())
    console.log('getSelectStatementByFieldName:', getSelectStatementByFieldName('LastName'))
    console.log('getSelectStatementById:', getSelectStatementById())
    console.log('getInsertStatement:', getInsertStatement())
    console.log('getUpdateStatement:', getUpdateByIdStatement())
    console.log('getDeleteStatementById:', getDeleteByIdStatement())
    console.log('getCreateStatement:', getCreateStatement())
  }

  return {
    selectAll: selectAll,
    selectById: selectWherId,
    selectWhereIn: selectWherIn,
    selectByField: selectWhereField,
    create: createTable,
    insert: insert,
    update: updateById,
    delete: deleteById,
    displayQueries: logQueries,
    dbRun: dbRun,
    dbSingle: dbSingle,
    dbAll: dbAll
  }
}
