const getRepositoryFactory = (db) => (fields, table) => {
  return {    
     log: console.log (db, fields, table)
  }
}

const db = 'db'
const fields = 'fields'
const table = 'table'
const repofac = getRepositoryFactory(db)
repofac(fields, table);

getRepositoryFactory('a')('b', 'c')

var sqrt0 = function(x) { 
  var result = x * x
  return result
}

const sqrt1 = (x) => { return x * x }
const sqrt2 = (x) => (x * x)
const sqrt3 = (x) => x * x
const sqrt4 = x => x * x

console.log (sqrt0(2))
console.log (sqrt1(2))
console.log (sqrt2(2))
console.log (sqrt3(2))
console.log (sqrt4(2))

// Du har
var Ansatte = [
  { id: 20, name: 'Hans Martin' },
  { id: 24, name: 'Torodd' },
  { id: 56, name: 'Mats' }
];
// Men trenger kun IDene
[20, 24, 56]

var ansattIder1 = [];
Ansatte.forEach(function (officer) {
  ansattIder1.push(officer.id);
});

const ansattIder = Ansatte.map(ansatt => ansatt.id);

let arr = [1,2,3,4,5,6];
let even = arr.filter(val => {
  return val % 2 === 0;
});
// even = [2,4,6]
console.log(even)

var numbers = [175, 50, 25];

const myFunc = (total, num) => total - num

const total =  numbers.reduce(myFunc);
console.log(total) // 100



const greetCurried = greeting => name => 
  console.log (greeting + ', ' + name) 

const greetHello = greetCurried("Heisann");

greetHello("Ole"); // Heisann, Ole
greetHello("Dole"); // Heisann, Dole

greetCurried ('Hallå')('MisterX'); // Hallå, MisterX

const prom = new Promise( resolve => 

  setTimeout(() =>  
    resolve('Og der var det gått to sekunder..')
    , 200)
)

prom.then(value => { console.log(value);});


function* generator(i) { 
  yield i; 
  while (true) {
    i = i + 10
    yield i;
  }
 }
 
 let i = 10
 //var gen = generator(10);
 var gen = generator(i);
 console.log(gen.next().value);// output: 10
 console.log(gen.next().value);// output: 20
 console.log(gen.next().value);// output: 30
 console.log(i)

 const erMedlem = true
 const pris = erMedlem ? "kr 20.00" : "kr 40.00"
 console.log (pris)

 var Ansatte1 = [
  { id: 20, name: 'Hans Martin' },
  { id: 24, name: 'Torodd' },
  { id: 56, name: 'Mats' }
];
Ansatte2 = [
  ...Ansatte1,
  { id: 56, name: 'Bjørn Ivar' }
]
console.log(Ansatte2)


var bonuser = [
  { id: 20, name: 'Hans Martin', kat: 'L', bonus: 300 },
  { id: 24, name: 'Torodd', kat: 'L', bonus: 270},
  { id: 56, name: 'Mats', kat: 'K', bonus: 220 },
  { id: 56, name: 'Christian', kat: 'K', bonus: 250 }
];

const bonusLedere = bonuser
  .filter((ans) => ans.kat === 'L' )
  .map((ans) => ans.bonus )
  .reduce((total, bonus) => total = total + bonus)

console.log(bonuser)
console.log('Bonus: ', bonusLedere)

const getLedere = ans => ans.kat === 'L'
const selBonus = ans => ans.bonus
const totBonus = (total, bonus) => total += bonus

const _bonusLedere = bonuser
  .filter(getLedere)
  .map(selBonus)
  .reduce(totBonus)

console.log(bonuser)
console.log(`Bonuser: ${_bonusLedere}`)

const getCreateStatement = () => fields.reduce((res, x, i) => {
    if (i === 0) {
      return `${res}${x.fieldName} integer primary key`
    } else if (i !== fields.length - 1) {
      return `${res}, ${x.fieldName} ${x.dataType}`
    } else {
      return `${res}, ${x.fieldName} ${x.dataType})`
    }
  }, [`CREATE TABLE IF NOT EXISTS ${table} (`])