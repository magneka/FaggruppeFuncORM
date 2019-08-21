exports.restController = (app, repository, endpoint) => {
  console.log(`Registrering endpoing: ${endpoint}`)

  app.get(`${endpoint}`, async function (req, res) {
    let rows = await repository.selectAll()
    res.json(rows)
  })

  app.get(`${endpoint}/employees`, async (req, res) => {
    let rows = await repository.getCompWithEmployees()
    res.json(rows)
  })

  app.get(`${endpoint}/:id`, async (req, res) => {
    let rows = await repository.selectById(req.params.id)
    if (rows === undefined) { res.status(404).send('') }
    res.json(rows)
  })

  // https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-46b0901f29b6
  app.put(`${endpoint}`, async (req, res) => {
    try {
      await repository.update(req.body)
      res.json('ok')
    } catch (err) { res.status(500).send(err) }
  })

  app.post(`${endpoint}`, async (req, res) => {
    try {
      await repository.insert(req.body)
      res.status(201).send('ok')
    } catch (err) { res.status(500).send(err) }
  })

  app.delete(`${endpoint}/:id`, async (req, res) => {
    try {
      await repository.delete(req.params.id)
      res.status(201).send('ok')
    } catch (err) { res.status(500).send(err) }
  })
}
