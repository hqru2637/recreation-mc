import { inspect } from 'bun';
/**
 * https://github.com/Bedrock-OSS/bedrock-boost/blob/main/src/Vec3.ts
 */

type VectorLike = Vec3 | IVec3 | number[] | number;

interface IVec3 {
  x: number;
  y: number;
  z: number;
}

export default class Vec3 implements IVec3 {
  public static readonly Zero = new Vec3(0, 0, 0);

  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number);
  constructor(x: Vec3);
  constructor(x: IVec3);
  constructor(x: number[]);
  constructor(x: VectorLike, y?: number, z?: number) {
    if (typeof x === "number") {
      this.x = x;
      this.y = y!;
      this.z = z!;
    } else if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else if (x instanceof Vec3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      if (!x || (!x.x && x.x !== 0) || (!x.y && x.y !== 0) || (!x.z && x.z !== 0)) {
        throw new Error("Invalid vector");
      }
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    }

  }
  /**
   * Creates a new vector from the given values.
   */
  static from(x: number, y: number, z: number): Vec3;
  static from(x: Vec3): Vec3;
  static from(x: IVec3): Vec3;
  static from(x: number[]): Vec3;
  static from(x: VectorLike, y?: number, z?: number): Vec3 {
    if (x instanceof Vec3) return x;
    if (typeof x === 'number' && y !== undefined && z !== undefined) {
      return new Vec3(x, y, z);
    }
    if (Array.isArray(x)) {
      return new Vec3(x);
    }
    if (!x || (!(x as any).x && (x as any).x !== 0) || (!(x as any).y && (x as any).y !== 0) || (!(x as any).z && (x as any).z !== 0)) {
      throw new Error('Invalid arguments');
    }
    return new Vec3((x as any).x as number, (x as any).y as number, (x as any).z as number);
  }
  private static _from(x: VectorLike, y?: number, z?: number): Vec3 {
    if (x instanceof Vec3) return x;
    if (typeof x === 'number' && y !== undefined && z !== undefined) {
      return new Vec3(x, y, z);
    }
    if (Array.isArray(x)) {
      return new Vec3(x);
    }
    if (!x || (!(x as any).x && (x as any).x !== 0) || (!(x as any).y && (x as any).y !== 0) || (!(x as any).z && (x as any).z !== 0)) {
      throw new Error('Invalid arguments');
    }
    return new Vec3((x as any).x as number, (x as any).y as number, (x as any).z as number);
  }
  /**
   * Creates a copy of the current vector.
   * 
   * @returns A new vector with the same values as the current vector.
   */
  copy(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Adds another vector to the current vector.
   *
   * @param v - The vector to be added.
   * @returns The updated vector after addition.
   */
  add(x: number, y: number, z: number): Vec3;
  add(x: Vec3): Vec3;
  add(x: IVec3): Vec3;
  add(x: number[]): Vec3;
  add(x: VectorLike, y?: number, z?: number): Vec3 {
    const v: Vec3 = Vec3._from(x, y, z);
    return Vec3.from(v.x + this.x, v.y + this.y, v.z + this.z);
  }
  /**
   * Subtracts another vector from the current vector.
   *
   * @param v - The vector to be subtracted.
   * @returns The updated vector after subtraction.
   */
  subtract(x: number, y: number, z: number): Vec3;
  subtract(x: Vec3): Vec3;
  subtract(x: IVec3): Vec3;
  subtract(x: number[]): Vec3;
  subtract(x: VectorLike, y?: number, z?: number): Vec3 {
    const v: Vec3 = Vec3._from(x, y, z);
    return Vec3.from(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  /**
   * Multiplies the current vector by another vector or scalar.
   *
   * @param v - The vector or scalar to multiply with.
   * @returns The updated vector after multiplication.
   */
  multiply(x: number, y: number, z: number): Vec3;
  multiply(x: Vec3): Vec3;
  multiply(x: IVec3): Vec3;
  multiply(x: number[]): Vec3;
  multiply(x: number): Vec3;
  multiply(x: VectorLike, y?: number, z?: number): Vec3 {
    if (typeof x === "number" && y === undefined && z === undefined) {
      return Vec3.from(this.x * x, this.y * x, this.z * x);
    }
    const v: Vec3 = Vec3._from(x, y, z);
    return Vec3.from(v.x * this.x, v.y * this.y, v.z * this.z);
  }
  /**
   * Scales the current vector by a scalar.
   *
   * @param v - The scalar to scale by.
   * @returns The updated vector after scaling.
   */
  scale(scalar: number): Vec3 {
    return Vec3.from(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  /**
   * Divides the current vector by another vector or scalar.
   *
   * @param v - The vector or scalar to divide by.
   * @returns The updated vector after division.
   */
  divide(x: number, y: number, z: number): Vec3;
  divide(x: Vec3): Vec3;
  divide(x: IVec3): Vec3;
  divide(x: number[]): Vec3;
  divide(x: number): Vec3;
  divide(x: VectorLike, y?: number, z?: number): Vec3 {
    if (typeof x === "number" && y === undefined && z === undefined) {
      if (x === 0) throw new Error("Cannot divide by zero");
      return Vec3.from(this.x / x, this.y / x, this.z / x);
    }
    const v: Vec3 = Vec3._from(x, y, z);
    if (v.x === 0 || v.y === 0 || v.z === 0) throw new Error("Cannot divide by zero");
    return Vec3.from(this.x / v.x, this.y / v.y, this.z / v.z);
  }
  /**
   * Normalizes the vector to have a length (magnitude) of 1.
   * Normalized vectors are often used as a direction vectors.
   *
   * @returns The normalized vector.
   */
  normalize(): Vec3 {
    if (this.isZero()) {
      throw new Error("Cannot normalize zero-length vector");
    }
    const len = this.length();
    return Vec3.from(this.x / len, this.y / len, this.z / len);
  }
  /**
   * Computes the length (magnitude) of the vector.
   *
   * @returns The length of the vector.
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }
  /**
   * Computes the squared length of the vector.
   * This is faster than computing the actual length and can be useful for comparison purposes.
   *
   * @returns The squared length of the vector.
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * Computes the cross product of the current vector with another vector.
   * 
   * A cross product is a vector that is perpendicular to both vectors.
   *
   * @param v - The other vector.
   * @returns A new vector representing the cross product.
   */
  cross(x: number, y: number, z: number): Vec3;
  cross(x: Vec3): Vec3;
  cross(x: IVec3): Vec3;
  cross(x: number[]): Vec3;
  cross(x: VectorLike, y?: number, z?: number): Vec3 {
    const v: Vec3 = Vec3._from(x, y, z);
    return Vec3.from(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  /**
   * Computes the distance between the current vector and another vector.
   *
   * @param v - The other vector.
   * @returns The distance between the two vectors.
   */
  distance(x: number, y: number, z: number): number;
  distance(x: Vec3): number;
  distance(x: IVec3): number;
  distance(x: number[]): number;
  distance(x: VectorLike, y?: number, z?: number): number {
    const v: Vec3 = Vec3._from(x, y, z);
    return Math.sqrt(this.distanceSquared(v));
  }
  /**
   * Computes the squared distance between the current vector and another vector.
   * This is faster than computing the actual distance and can be useful for comparison purposes.
   *
   * @param v - The other vector.
   * @returns The squared distance between the two vectors.
   */
  distanceSquared(x: number, y: number, z: number): number;
  distanceSquared(x: Vec3): number;
  distanceSquared(x: IVec3): number;
  distanceSquared(x: number[]): number;
  distanceSquared(x: VectorLike, y?: number, z?: number): number {
    const v: Vec3 = Vec3._from(x, y, z);
    return this.subtract(v).lengthSquared();
  }
  /**
   * Computes the linear interpolation between the current vector and another vector, when t is in the range [0, 1].
   * Computes the extrapolation when t is outside this range.
   *
   * @param v - The other vector.
   * @param t - The interpolation factor.
   * @returns A new vector after performing the lerp operation.
   */
  lerp(v: IVec3, t: number): Vec3 {
    if (!v || !t) return Vec3.from(this);
    if (t === 1) return Vec3.from(v);
    if (t === 0) return Vec3.from(this);
    return Vec3.from(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t
    );
  }
  /**
   * Computes the spherical linear interpolation between the current vector and another vector, when t is in the range [0, 1].
   * Computes the extrapolation when t is outside this range.
   *
   * @param v - The other vector.
   * @param t - The interpolation factor.
   * @returns A new vector after performing the slerp operation.
   */
  slerp(v: IVec3, t: number): Vec3 {
    if (!v || !t) return Vec3.from(this);
    if (t === 1) return Vec3.from(v);
    if (t === 0) return Vec3.from(this);
    const dot = this.dot(v);
    const theta = Math.acos(dot) * t;
    const relative = Vec3.from(v).subtract(this.multiply(dot)).normalize();
    return this
      .multiply(Math.cos(theta))
      .add(relative.multiply(Math.sin(theta)));
  }
  /**
   * Computes the dot product of the current vector with another vector.
   *
   * @param v - The other vector.
   * @returns The dot product of the two vectors.
   */
  dot(x: number, y: number, z: number): number;
  dot(x: Vec3): number;
  dot(x: IVec3): number;
  dot(x: number[]): number;
  dot(x: VectorLike, y?: number, z?: number): number {
    const v: Vec3 = Vec3._from(x, y, z);
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  /**
   * Computes the angle (in radians) between the current vector and another vector.
   *
   * @param v - The other vector.
   * @returns The angle in radians between the two vectors.
   */
  angleBetween(x: number, y: number, z: number): number;
  angleBetween(x: Vec3): number;
  angleBetween(x: IVec3): number;
  angleBetween(x: number[]): number;
  angleBetween(x: VectorLike, y?: number, z?: number): number {
    const v: Vec3 = Vec3._from(x, y, z);
    const dotProduct = this.dot(v);
    const lengths = this.length() * v.length();
    if (lengths === 0) {
      return 0;
    }
    return Math.acos(dotProduct / lengths);
  }
  /**
   * Computes the projection of the current vector onto another vector.
   * This method finds how much of the current vector lies in the direction of vector `v`.
   *
   * @param v - The vector onto which the current vector will be projected.
   * @returns A new vector representing the projection of the current vector onto `v`.
   */
  projectOnto(x: number, y: number, z: number): Vec3;
  projectOnto(x: Vec3): Vec3;
  projectOnto(x: IVec3): Vec3;
  projectOnto(x: number[]): Vec3;
  projectOnto(x: VectorLike, y?: number, z?: number): Vec3 {
    const v: Vec3 = Vec3._from(x, y, z);
    // If the vector is zero-length, then the projection is the zero vector.
    if (v.isZero()) {
      return Vec3.Zero;
    }
    const scale = this.dot(v) / v.dot(v);
    return Vec3.from(v.x * scale, v.y * scale, v.z * scale);
  }
  /**
   * Computes the reflection of the current vector against a normal vector.
   * Useful for simulating light reflections or bouncing objects.
   *
   * @param normal - The normal vector against which the current vector will be reflected.
   * @returns A new vector representing the reflection of the current vector.
   */
  reflect(x: number, y: number, z: number): Vec3;
  reflect(x: Vec3): Vec3;
  reflect(x: IVec3): Vec3;
  reflect(x: number[]): Vec3;
  reflect(x: VectorLike, y?: number, z?: number): Vec3 {
    const normal: Vec3 = Vec3._from(x, y, z);
    const proj = this.projectOnto(normal);
    return this.subtract(proj.multiply(2));
  }
  /**
   * Rotates the current normalized vector by a given angle around a given axis.
   * 
   * @param axis - The axis of rotation.
   * @param angle - The angle of rotation in degrees.
   * @returns The rotated vector.
   */
  rotate(axis: IVec3, angle: number): Vec3 {
    // Convert angle from degrees to radians and compute half angle
    const halfAngle = angle * Math.PI / 180 / 2;

    // Quaternion representing the rotation
    const w = Math.cos(halfAngle);
    const x = axis.x * Math.sin(halfAngle);
    const y = axis.y * Math.sin(halfAngle);
    const z = axis.z * Math.sin(halfAngle);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const v = this;

    // Rotate vector (v) using quaternion
    // Simplified direct computation reflecting quaternion rotation and its conjugate effect
    const qv_x = w * w * v.x + 2 * y * w * v.z - 2 * z * w * v.y + x * x * v.x + 2 * y * x * v.y + 2 * z * x * v.z - z * z * v.x - y * y * v.x;
    const qv_y = 2 * x * y * v.x + y * y * v.y + 2 * z * y * v.z + 2 * w * z * v.x - z * z * v.y + w * w * v.y - 2 * x * w * v.z - x * x * v.y;
    const qv_z = 2 * x * z * v.x + 2 * y * z * v.y + z * z * v.z - 2 * w * y * v.x - y * y * v.z + 2 * w * x * v.y - x * x * v.z + w * w * v.z;

    return new Vec3(qv_x, qv_y, qv_z);
  }
  /**
   * Sets the X component of the vector.
   *
   * @param value - The new X value.
   * @returns The updated vector with the new X value.
   */
  setX(value: number): Vec3 {
    return new Vec3(value, this.y, this.z);
  }
  /**
   * Sets the Y component of the vector.
   *
   * @param value - The new Y value.
   * @returns The updated vector with the new Y value.
   */
  setY(value: number): Vec3 {
    return new Vec3(this.x, value, this.z);
  }
  /**
   * Sets the Z component of the vector.
   *
   * @param value - The new Z value.
   * @returns The updated vector with the new Z value.
   */
  setZ(value: number): Vec3 {
    return new Vec3(this.x, this.y, value);
  }
  /**
   * Calculates the shortest distance between a point (represented by this IVec3 instance) and a line segment.
   * 
   * This method finds the perpendicular projection of the point onto the line defined by the segment. If this 
   * projection lies outside the line segment, then the method calculates the distance from the point to the 
   * nearest segment endpoint.
   * 
   * @param start - The starting point of the line segment.
   * @param end - The ending point of the line segment.
   * @returns The shortest distance between the point and the line segment.
   */
  distanceToLineSegment(start: IVec3, end: IVec3): number {
    const lineDirection = Vec3.from(end).subtract(start);
    // If the line is zero-length, then the distance is the distance to the start point.
    if (lineDirection.lengthSquared() === 0) {
      return this.subtract(start).length();
    }
    const t = Math.max(0, Math.min(1, this.subtract(start).dot(lineDirection) / lineDirection.dot(lineDirection)));
    const projection = Vec3.from(start).add(lineDirection.multiply(t));
    return this.subtract(projection).length();
  }
  /**
   * Floors the X, Y, and Z components of the vector.
   * @returns A new vector with the floored components.
   */
  floor(): Vec3 {
    return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }
  /**
   * Floors the X component of the vector.
   * @returns A new vector with the floored X component.
   */
  floorX(): Vec3 {
    return new Vec3(Math.floor(this.x), this.y, this.z);
  }
  /**
   * Floors the Y component of the vector.
   * @returns A new vector with the floored Y component.
   */
  floorY(): Vec3 {
    return new Vec3(this.x, Math.floor(this.y), this.z);
  }
  /**
   * Floors the Z component of the vector.
   * @returns A new vector with the floored Z component.
   */
  floorZ(): Vec3 {
    return new Vec3(this.x, this.y, Math.floor(this.z));
  }
  /**
   * Ceils the X, Y, and Z components of the vector.
   * @returns A new vector with the ceiled components.
   */
  ceil(): Vec3 {
    return new Vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
  }
  /**
   * Ceils the X component of the vector.
   * @returns A new vector with the ceiled X component.
   */
  ceilX(): Vec3 {
    return new Vec3(Math.ceil(this.x), this.y, this.z);
  }
  /**
   * Ceils the Y component of the vector.
   * @returns A new vector with the ceiled Y component.
   */
  ceilY(): Vec3 {
    return new Vec3(this.x, Math.ceil(this.y), this.z);
  }
  /**
   * Ceils the Z component of the vector.
   * @returns A new vector with the ceiled Z component.
   */
  ceilZ(): Vec3 {
    return new Vec3(this.x, this.y, Math.ceil(this.z));
  }
  /**
   * Rounds the X, Y, and Z components of the vector.
   * @returns A new vector with the rounded components.
   */
  round(): Vec3 {
    return new Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }
  /**
   * Rounds the X component of the vector.
   * @returns A new vector with the rounded X component.
   */
  roundX(): Vec3 {
    return new Vec3(Math.round(this.x), this.y, this.z);
  }
  /**
   * Rounds the Y component of the vector.
   * @returns A new vector with the rounded Y component.
   */
  roundY(): Vec3 {
    return new Vec3(this.x, Math.round(this.y), this.z);
  }
  /**
   * Rounds the Z component of the vector.
   * @returns A new vector with the rounded Z component.
   */
  roundZ(): Vec3 {
    return new Vec3(this.x, this.y, Math.round(this.z));
  }
  /**
   * Returns a new vector offset from the current vector up by 1 block.
   * @returns A new vector offset from the current vector up by 1 block.
   */
  up(): Vec3 {
    return this.add(0, 1, 0);
  }
  /**
   * Returns a new vector offset from the current vector down by 1 block.
   * @returns A new vector offset from the current vector down by 1 block.
   */
  down(): Vec3 {
    return this.add(0, -1, 0);
  }
  /**
   * Checks if the current vector is equal to the zero vector.
   * @returns true if the vector is equal to the zero vector, else returns false.
   */
  isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  /**
   * Converts the vector to an array containing the X, Y, and Z components of the vector.
   * @returns An array containing the X, Y, and Z components of the vector.
   */
  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  /**
   * Returns a new vector with the X, Y, and Z components rounded to the nearest block location.
   */
  toBlockLocation(): Vec3 {
    // At this point I'm not sure if it wouldn't be better to use Math.floor instead
    return Vec3.from(
      (this.x << 0) - (this.x < 0 && this.x !== (this.x << 0) ? 1 : 0),
      (this.y << 0) - (this.y < 0 && this.y !== (this.y << 0) ? 1 : 0),
      (this.z << 0) - (this.z < 0 && this.z !== (this.z << 0) ? 1 : 0)
    );
  }
  /**
   * Checks if the current vector is equal to another vector.
   * @param other
   */
  almostEqual(x: number, y: number, z: number, delta: number): boolean;
  almostEqual(x: Vec3, delta: number): boolean;
  almostEqual(x: IVec3, delta: number): boolean;
  almostEqual(x: number[], delta: number): boolean;
  almostEqual(x: VectorLike, y: number, z?: number, delta?: number) {
    try {
      let other: Vec3;
      if (typeof x !== 'number' && z === undefined) {
        other = Vec3._from(x, undefined, undefined);
        delta = y!;
      } else {
        other = Vec3._from(x, y, z);
      }
      return Math.abs(this.x - other.x) <= delta! && Math.abs(this.y - other.y) <= delta! && Math.abs(this.z - other.z) <= delta!;
    } catch (e) {
      return false;
    }
  }
  /**
   * Checks if the current vector is equal to another vector.
   * @param other
   */
  equals(x: number, y: number, z: number): boolean;
  equals(x: Vec3): boolean;
  equals(x: IVec3): boolean;
  equals(x: number[]): boolean;
  equals(x: VectorLike, y?: number, z?: number) {
    try {
      const other: Vec3 = Vec3._from(x, y, z);
      return this.x === other.x && this.y === other.y && this.z === other.z;
    } catch (e) {
      return false;
    }
  }

  toString(format: 'long'|'short' = 'long', separator: string = ', '): string {
    const result = `${this.x + separator + this.y + separator + this.z}`;
    return format === 'long' ? `Vec3(${result})` : result;
  }

  [inspect.custom]() {
    return { x: this.x, y: this.y, z: this.z }
  }
}