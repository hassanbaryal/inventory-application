#! /usr/bin/env node

console.log(
  'This script populates some test cars, brands, car types and carinstances to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
// eslint-disable-next-line import/no-extraneous-dependencies
const async = require('async');
const mongoose = require('mongoose');
const Car = require('./models/car');
const Brand = require('./models/brand');
const CarType = require('./models/carType');
const CarInstance = require('./models/carInstance');

mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];


async function main() {
  await mongoose.connect(mongoDB);
}

main().catch(err => console.log(err));

const brands = [];
const carTypes = [];
const cars = [];
const carinstances = [];

function brandCreate(name, description, cb) {
  const branddetail = { name, description };

  const brand = new Brand(branddetail);

  brand.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Brand: ${brand}`);
    brands.push(brand);
    cb(null, brand);
  });
}

function carTypeCreate(name, cb) {
  const carType = new CarType({ name });

  carType.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Car Type: ${carType}`);
    carTypes.push(carType);
    cb(null, carType);
  });
}

function carCreate(name, description, brand, carType, cb) {
  const cardetail = {
    name,
    description,
    brand,
  };
  if (carType !== false) cardetail.carType = carType;

  const car = new Car(cardetail);
  car.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Car: ${car}`);
    cars.push(car);
    cb(null, car);
  });
}

function carInstanceCreate(car, description, price, condition, year, cb) {
  const carinstancedetail = {
    car,
    description,
    price,
    condition,
    year,
  };

  const carinstance = new CarInstance(carinstancedetail);
  carinstance.save((err) => {
    if (err) {
      console.log(`ERROR CREATING BookInstance: ${carinstance}`);
      cb(err, null);
      return;
    }
    console.log(`New BookInstance: ${carinstance}`);
    carinstances.push(carinstance);
    cb(null, carinstance);
  });
}

function createCarTypesBrands(cb) {
  async.series(
    [
      function (callback) {
        brandCreate(
          'Hyundai',
          'Hyundai is a South Korean multinational automotive manufacturer headquartered in Seoul, South Korea, and founded in 1967. Currently, the company owns 33.88 percent of Kia Corporation, and also fully owns two marques including its luxury cars subsidiary, Genesis Motor, and an electric vehicle sub-brand, Ioniq. Those three brands altogether comprise the Hyundai Motor Group.',
          callback
        );
      },
      function (callback) {
        brandCreate(
          'Toyota',
          'Toyota is a Japanese multinational automotive manufacturer headquartered in Toyota City, Aichi, Japan. It was founded by Kiichiro Toyoda and incorporated on August 28, 1937. Toyota is one of the largest automobile manufacturers in the world, producing about 10 million vehicles per year.',
          callback
        );
      },
      function (callback) {
        brandCreate(
          'Honda',
          'is a Japanese public multinational conglomerate manufacturer of automobiles, motorcycles, and power equipment, headquartered in Minato, Tokyo, Japan.',
          callback
        );
      },
      function (callback) {
        carTypeCreate('Sedan', callback);
      },
      function (callback) {
        carTypeCreate('Coupe', callback);
      },
      function (callback) {
        carTypeCreate('Hatchback', callback);
      },
      function (callback) {
        carTypeCreate('SUV', callback);
      },
      function (callback) {
        carTypeCreate('Minivan', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createCars(cb) {
  async.parallel(
    [
      function (callback) {
        carCreate(
          'Hyundai Elantra',
          'The Hyundai Elantra, also known as the Hyundai Avante (Korean: 현대 아반떼), is a compact car produced by the South Korean manufacturer Hyundai since 1990.',
          brands[0],
          carTypes[0],
          callback
        );
      },
      function (callback) {
        carCreate(
          'Hyundai Tucson',
          "The Hyundai Tucson (Korean: 현대 투싼) (pronounced Tu-són) is a compact crossover SUV[1] produced by the South Korean manufacturer Hyundai since 2004. In the brand's lineup, the Tucson is positioned below the Santa Fe, and above the Kona and Creta.",
          brands[0],
          carTypes[3],
          callback
        );
      },
      function (callback) {
        carCreate(
          'Honda Civic',
          "The Honda Civic (Japanese: ホンダ・シビック, Hepburn: Honda Shibikku) is a series of automobiles manufactured by Honda since 1972. Since 2000, the Civic has been categorized as a compact car, while previously it occupied the subcompact class. As of 2021, the Civic is positioned between the Honda Fit/City and Honda Accord in Honda's global car line-up.",
          brands[2],
          carTypes[0],
          callback
        );
      },
      function (callback) {
        carCreate(
          'Toyota Sienna',
          'Summary of toyota sienna',
          brands[1],
          carTypes[4],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createCarInstances(cb) {
  async.parallel(
    [
      function (callback) {
        carInstanceCreate(
          cars[0],
          'Odometer: 14k kms.',
          18000,
          'Used',
          2019,
          callback
        );
      },
      function (callback) {
        carInstanceCreate(
          cars[0],
          'Completely brand new',
          45000,
          'New',
          2023,
          callback
        );
      },
      function (callback) {
        carInstanceCreate(
          cars[1],
          'Has served me well. Thank you, bessy',
          500,
          'Used',
          2008,
          callback
        );
      },
      function (callback) {
        carInstanceCreate(cars[1], '-', 7000, 'Used', 2010, callback);
      },
      function (callback) {
        carInstanceCreate(
          cars[1],
          'Brand new. Sunroof. Heated seats and steering wheel. Android auto',
          33500,
          'New',
          2022,
          callback
        );
      },
      function (callback) {
        carInstanceCreate(
          cars[3],
          'Very nice sienna. Special price',
          19999,
          'Used',
          2018,
          callback
        );
      },
      function (callback) {
        carInstanceCreate(
          cars[3],
          'Driven for only 5k kms.',
          25000,
          'Used',
          2023,
          callback
        );
      },
      function (callback) {
        carInstanceCreate(cars[2], '-', 24000, 'New', 2021, callback);
      },
      function (callback) {
        carInstanceCreate(cars[2], '-', 27000, 'New', 2022, callback);
      },
      function (callback) {
        carInstanceCreate(cars[2], '-', 30000, 'New', 2023, callback);
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createCarTypesBrands, createCars, createCarInstances],
  // Optional callback
  (err) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    } else {
      console.log(`BOOKInstances: ${carinstances}`);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
