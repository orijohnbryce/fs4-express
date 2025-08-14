import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { promises as fs } from 'fs';
import { Car } from '../types';
import { carsFile } from '../config';

export async function loadCars(): Promise<Car[]> {
    // const fileContent = await fs.readFile("./cars.csv", "utf-8");
    const fileContent = await fs.readFile(carsFile, "utf-8");
    const cars: Car[] = parse(fileContent, { columns: true, cast: true })
    return cars;
}

async function writeCars(cars: Car[]): Promise<void> {
    const data = stringify(cars, { header: true });
    fs.writeFile(carsFile, data, "utf-8");
}

export async function addCar(car: Car): Promise<void> {
    const carRow =  `\n${car.id},${car.name},${car.km},${car.engine},${car.year},${car.price}`
    try {
        await fs.appendFile(carsFile, carRow)        
    } catch (error) {
        console.log(error);
        throw error;
    }
}