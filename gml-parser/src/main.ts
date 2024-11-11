import { readFileSync } from 'node:fs';

export enum DataType {
  /** Represents 3d model for buildings */
  Building,
  /** Represents terrain model */
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