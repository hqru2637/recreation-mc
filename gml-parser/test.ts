import { readFileSync, writeFileSync, readdirSync, copyFileSync, statSync } from 'fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const TARGET_NUMBER = 543967;
const TARGET_INDEXES = [
  70, 71, 72, 73, 74,
  60, 61, 62, 63, 64,
          52, 53, 54,
]

let buildingCount = 0;

console.time();

processMap();

console.timeEnd()

function getBuildings() {
  if (!statSync('./output/buildings.json')) return;
  const file = readFileSync('./output/buildings.json', 'utf-8');
  const buildings = JSON.parse(file);
  return buildings;
}

function processMap() {
  const maps: MapInfo[] = []
  for (const index of TARGET_INDEXES) {
    const fileName = `${TARGET_NUMBER}${index}_bldg_6697_op.gml`;
    const { buildings, average } = parse(
      readFileSync(`./data/bldg/${fileName}`)
    );
    console.log(fileName, buildings.length, average);
    // copyFileSync(`./data/bldg/${fileName}`, `./output/map_${TARGET_NUMBER}_${index}.gml`);
  
  
    buildingCount += buildings.length;

    maps.push({ areaIndex: TARGET_NUMBER, index, buildings });
  }
  
  console.log(buildingCount);

  writeFileSync('./output/buildings.json', JSON.stringify(maps, null, 2));
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Building {
  polygons: Vec3[];
  min?: Vec3;
  max?: Vec3;
}

interface MapInfo {
  buildings: Building[];
  areaIndex: number;
  index: number;
}

interface ParseResult {
  buildings: Building[];
  average: Vec3;
}

function parse(data: Buffer): ParseResult {
  const parser = new XMLParser();
  const parsed = parser.parse(data);
  const cityModel = parsed['core:CityModel'];
  const objects: any[] = cityModel['core:cityObjectMember'];
  let average: Vec3 = { x: 0, y: 0, z: 0 };

  const buildings: Building[] = objects.map((o: any) => {
    const polygonValues: number[] = o['bldg:Building']['bldg:lod0RoofEdge']['gml:MultiSurface']['gml:surfaceMember']['gml:Polygon']['gml:exterior']['gml:LinearRing']['gml:posList']
      .split(' ')
      .map(Number);
    const polygons: Vec3[] = [];
    let max: Vec3 | undefined;
    let min: Vec3 | undefined;

    let i = 0;
    while (i < polygonValues.length) {
      const pos = {
        x: polygonValues[i],
        y: polygonValues[i + 1],
        z: polygonValues[i + 2],
      }
      average = add(average, pos); 
      polygons.push(pos);
      max ??= { ...pos };
      min ??= { ...pos };
      max.x = Math.max(max.x, pos.x);
      max.y = Math.max(max.y, pos.y);
      max.z = Math.max(max.z, pos.z);
      min.x = Math.min(min.x, pos.x);
      min.y = Math.min(min.y, pos.y);
      min.z = Math.min(min.z, pos.z);
      i += 3;
    }
    return {
      polygons,
      max,
      min
    };
  });
  
  // console.log(buildings.filter(b => (
  //   36.551343 < b.min!.x && b.max!.x < 36.554949 &&
  //   139.910330 < b.min!.y && b.max!.y < 139.915754
  // )));

  // console.log(
  //   cityModel['gml:boundedBy']['gml:Envelope']
  // );

  // 36.554949 139.910330
  // 36.551343 139.915754

  return { buildings, average: devide(average, buildings.length) }
}

function add(v1: Vec3, v2: Vec3) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z
  }
}

function devide(v: Vec3, n: number) {
  return {
    x: v.x / n,
    y: v.y / n,
    z: v.z / n
  }
}