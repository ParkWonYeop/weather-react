export interface CountyType {
    readonly County: string;
  }
  
export interface LocalInfoType {
    readonly id: number,
    readonly county: string,
    readonly city: string,
    readonly latitude: number,
    readonly longitude: number
}
  
export interface WeatherInfoType {
    readonly area:number,
    readonly PTY: number,
    readonly REH: number,
    readonly RN1: number,
    readonly T1H: number,
    readonly UUU: number,
    readonly VVV: number,
    readonly VEC: number,
    readonly WSD: number,
}