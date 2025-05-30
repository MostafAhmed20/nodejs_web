import mongoose from 'mongoose';

export const codeSchema = new mongoose.Schema({
  code: String,
  description: String,
  information: String,
  solution: String,
  details: String,
});


export function getCarModel(modelName) {
    const normalizedName = modelName.replace(/\s+/g, '_').toLowerCase(); // e.g. 'Toyota Camry' => 'toyota_camry'
    
    if (mongoose.models[normalizedName]) {
      return mongoose.models[normalizedName]; // return existing model
    }
  
    const carSchema = new mongoose.Schema({
      P: [codeSchema],
      U: [codeSchema],
      B: [codeSchema],
      C: [codeSchema]
    });
  
    return mongoose.model(normalizedName, carSchema, normalizedName); // last param sets collection name explicitly
  }

export async function insertCode(modelName, arrayName, codeObject) {
    const CarModel = getCarModel(modelName); // dynamic model for this car
    const car = await CarModel.findOne() || new CarModel(); // find or create a new one
  
    if (!['P', 'U', 'B', 'C'].includes(arrayName)) {
      throw new Error('Invalid array name. Must be one of: P, U, B, C.');
    }
    car[arrayName].push(codeObject);
    await car.save();
  
    console.log(`Inserted code into ${modelName} > ${arrayName}`);
  }
  




/*
  await insertCode('Toyota Camry', 'P', {
    code: 'P0300',
    description: 'Random Cylinder Misfire',
    information: 'This code indicates that the engine control module (ECM) has detected a misfire in one or more cylinders.',
    solution: 'Check spark plugs, ignition coils, and fuel injectors. Ensure proper fuel quality and check for vacuum leaks.',
    details: 'A misfire can cause poor engine performance, increased emissions, and potential damage to the catalytic converter.'
  });
  */