export interface Scooter {
  id: number;
  lat: number;
  long: number;
}
export interface Route {
  routes: RouteElement[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface RouteElement {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: Leg[];
  geometry: Geometry;
}

export interface Geometry {
  coordinates: Array<number[]>;
  type: Type;
}

export enum Type {
  LineString = 'LineString',
}

export interface Leg {
  via_waypoints: any[];
  annotation: Annotation;
  admins: Admin[];
  weight: number;
  duration: number;
  steps: Step[];
  distance: number;
  summary: Summary;
}

export interface Admin {
  iso_3166_1_alpha3: string;
  iso_3166_1: string;
}

export interface Annotation {
  distance: number[];
  duration: number[];
}

export interface Step {
  intersections: Intersection[];
  maneuver: Maneuver;
  name: Summary;
  duration: number;
  distance: number;
  driving_side: DrivingSide;
  weight: number;
  mode: Mode;
  geometry: Geometry;
}

export enum DrivingSide {
  Right = 'right',
}

export interface Intersection {
  bearings: number[];
  entry: boolean[];
  mapbox_streets_v8?: MapboxStreetsV8;
  is_urban?: boolean;
  admin_index: number;
  out?: number;
  geometry_index: number;
  location: number[];
  in?: number;
  turn_weight?: number;
  turn_duration?: number;
  duration?: number;
  weight?: number;
}

export interface MapboxStreetsV8 {
  class: Class;
}

export enum Class {
  Service = 'service',
  Tertiary = 'tertiary',
}

export interface Maneuver {
  type: string;
  instruction: string;
  bearing_after: number;
  bearing_before: number;
  location: number[];
  modifier?: string;
}

export enum Mode {
  Walking = 'walking',
}

export enum Summary {
  AlSabtStreet = 'Al Sabt Street',
  Empty = '',
}

export interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}
