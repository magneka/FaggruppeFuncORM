/* eslint-disable no-return-await */
const companyDef = {
  tableName: 'Company',
  fields:
        [
          { fieldName: 'Id', dataType: 'Integer' },
          { fieldName: 'CompanyName', dataType: 'Varchar(50)' }
        ]
}

exports.createRepository = factory => {
  let result = factory(companyDef.fields, companyDef.tableName)
  const qAll = 'select * from company c, employee e where e.CompanyId = c.Id'
  const getCompanyWithEmployees = async (companyId) => await result.dbAll(qAll)
  const newresult = { ...result, getCompWithEmployees: getCompanyWithEmployees }
  return newresult
}
