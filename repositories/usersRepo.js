const usersDef = {
  tableName: 'Users',
  fields:
        [
          { fieldName: 'Id', dataType: 'Integer' },
          { fieldName: 'Name', dataType: 'Varchar(50)' },
          { fieldName: 'Address', dataType: 'Varchar(50)' },
          { fieldName: 'PostalCode', dataType: 'Varchar(5)' },
          { fieldName: 'PostalCity', dataType: 'Varchar(50)' },
          { fieldName: 'Phone', dataType: 'Varchar(15)' },
        ]
}

exports.createRepository = factory => factory(usersDef.fields, usersDef.tableName)
