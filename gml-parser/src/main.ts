import { readFileSync } from 'node:fs';

export enum DataType {
  Building,
  DEM,
}

export class Main {
  public data: Buffer;
  
  constructor(
    public readonly type: DataType,
    public readonly path: string,
  ) {
    this.data = readFileSync(path);
  }


}