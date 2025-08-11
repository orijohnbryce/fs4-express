import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { promises as fs } from 'fs';
import { Car } from '../types';



async function loadCars(): Promise<Car[]> {
    const fileContent = await fs.readFile("./cars.csv", "utf-8");
    const cars: Car[] = parse(fileContent, { columns: true, cast: true })
    return cars;
}

async function writeCars(cars: Car[]): Promise<void> {
    const data = stringify(cars, { header: true });
    fs.writeFile("./cars.csv", data, "utf-8");
}


