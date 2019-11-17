/* eslint-disable no-return-await */
exports.getRepositoryFactory = db => (fields, table) => {
  // ----------------------------------------------------------------------------------------
  // Fields lists
  // ----------------------------------------------------------------------------------------

  // getIdField
  // getNonIdFields
  // getAllFields
  
  const getIdField = () => fields.map((f) => f.fieldName).shift()
  const getNonIdFields = () => fields.map((f) => f.fieldName).slice(1)
  const getAllFields = () => fields.map((f) => f.fieldName)

  // getParmsInOrder
  // transform json object to array with fields in correct order for insert and update
  const getParmsInOrder = (jsonObj, forUpdate = false) => {
    const validFieldNames = getNonIdFields(fields)

    let paramArr = validFieldNames.reduce((res, fieldname) => {
      if (jsonObj.hasOwnProperty(fieldname)) res.push(jsonObj[fieldname])
      else res.push(null)
      return res
    }, [])

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
  // getSelectStatementById         - select a, b, .. from table where id = 1
  // getSelectStatementIn           - select a, b, .. from table where a in 1, 2, 3
  // getSelectStatementByFieldName  - select a, b, .. from table where b = 1
  // getInsertStatement             - insert into table (a, b, c) values (1, 2, 3)
  // getUpdateByIdStatement         - update table set b=1, c=2 where id = 1 
  // getDeleteByIdStatement         - delete from table where a = 1
  // getLastId                      - select rowid from table order by rowid desc limit 1

  const getSelectStatement = () => `SELECT ${getAllFields().join(', ')} FROM ${table}`
  const getSelectStatementById = () => `${getSelectStatement()} WHERE ${getIdField()} = ?`
  const getSelectStatementIn = (parm) => `${getSelectStatement()} WHERE ${getIdField()} in (${parm.map(() => '?').join(', ')})`
  const getSelectStatementByFieldName = (searchBy) => `${getSelectStatement()} WHERE ${searchBy} = ?`
  const getInsertStatement = () => `INSERT INTO ${table} (${getNonIdFields().join(', ')}) VALUES (` + getNonIdFields().map(() => '?').join(', ') + ')'
  const getUpdateByIdStatement = () => `UPDATE ${table} SET ${getNonIdFields().map((f) => f + ' = ?').join(', ')}  WHERE ${getIdField()} = ?`
  const getDeleteByIdStatement = () => `DELETE FROM ${table} WHERE ${getIdField()} = ?`
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
  // insert
  // selectAll
  // selectWherId
  // selectWherIn
  // selectWhereField 
  // updateById
  // deleteById 

  const selectAll = async () => await dbAll(getSelectStatement(), [])
  const selectWherId = async (id) => await dbSingle(getSelectStatementById(), [id])
  const selectWherIn = async (parm) => await dbAll(getSelectStatementIn(parm), parm)
  const selectWhereField = async (field, parm) => await dbAll(getSelectStatementByFieldName(field), parm)
  const createTable = async () => await dbRun(getCreateStatement(), [])
  const insert = async (jsonObj) => { await dbSingle(getInsertStatement(), getParmsInOrder(jsonObj)); let newId = await dbSingle(getLastId()); return { ...jsonObj, [getIdField()]: newId.Id } }
  const updateById = async (jsonObj) => dbRun(await getUpdateByIdStatement(), getParmsInOrder(jsonObj, true))
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
    // selectAll: selectAll,
    // selectById: selectWherId,
    // selectWhereIn: selectWherIn,
    // selectByField: selectWhereField,
    // create: createTable,
    // insert: insert,
    // update: updateById,
    // delete: deleteById,
    // displayQueries: logQueries,
    // dbRun: dbRun,
    // dbSingle: dbSingle,
    // dbAll: dbAll

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
