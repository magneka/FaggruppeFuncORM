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

exports.createRepository = factory => factory(employeeDef.fields, employeeDef.tableName)
