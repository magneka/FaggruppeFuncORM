module.exports = function (app, empRepo) {
  console.log('Registering endpoint: /api/employees')

  app.get('/api/employees', async function (req, res) {
    let rows = await empRepo.selectAll()
    res.json(rows)
  })

  app.get('/api/employees/:id', async function (req, res) {
    let rows = await empRepo.selectById(req.params.id)
    if (rows !== undefined) {
      res.json(rows)
    } else {
      res.status(404).send('')
    }
  })

  app.post('/api/employees', async function (req, res) {
    if (req.body.Id === '') {
      empRepo.insert(req.body)
        .then(function (err) {
          if (!err) {
            res.redirect('/api/employees')
          }
        })
        .catch(next)
    }
    else
    {
      console.log("Updating Id:" + req.body.id );
      empRepo.insert(req.body)   
        .then(function (err) {
          if (!err)
            res.redirect('/customers')
          else
            res.status(404).send();

        })
        .catch(next)
    }
  })
}
/*
router.get('/', function (req, res, next) {

    customerRepository.getAllCustomers()
    .then(function (model) {
        res.render('customerlist', model)
    })
    .catch(next)
});

router.get('/new/', function (req, res) {
    var model = {
        id: '',
        firstname: '',
        lastname:''
    };
    res.render('editform', model);
});

router.get('/edit/:id', function (req, res, next) {
    if (req.params.id !== undefined){
        console.log("retrieve customer: " + req.params.id);
        customerRepository.getCustomerById(req.params)
        .then(function (model) {
            if (model !== undefined) {
                res.render('editform', model)
            } else {
                 res.status(404).send("");
            }
        })
        .catch(next)
    }
});

router.post('/edit', function (req, res, next) {
    if (req.body.id === '') {
        customerRepository.createCustomer(req.body)
        .then(function (err) {
            if (!err) {
               res.redirect('/customers')
            }
        })
        .catch(next)
    }
    else
    {
        console.log("Updating Id:" + req.body.id );
        customerRepository.updateCustomer(req.body)
        .then(function (err) {
            if (!err)
               res.redirect('/customers')
            else
               res.status(404).send();

        })
        .catch(next)
    }
});

router.get('/delete/:id', function (req, res, next) {
    if (req.params.id !== undefined){
        console.log("retrieve customer: " + req.params.id);

        customerRepository.getCustomerById(req.params)
        .then(function (model) {
            if (model !== undefined) {
                res.render('customerdelete', model);
            } else {
                 res.status(404).send("");
            }
        })
        .catch(next)

    }
});

router.post('/delete', function (req, res, next) {
    if (req.body.id !== ''){
        customerRepository.deleteCustomer(req.body)
        .then(function (err) {
            if (err !== undefined) {
                res.redirect('/customers')
            } else {
                 res.status(404).send("");
            }
        })
        .catch(next)
    }
});

module.exports = function Database(custDao) {
    customerRepository = custDao;
    return router;
};

*/
