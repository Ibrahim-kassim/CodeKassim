import { ENTITIES } from '../models/entities';

export interface QueryParams {
  children?: ENTITIES[];
  page_num?: number;
  page_size?: number;
  ds_col?: string[];
  ds_interval?: string;
  ds_nb_pts?: number;
  sorters?: QueryParamSorters[];
  filter?: QueryParamFilter[];
}

export interface QueryParamFilter {
  filter_col?: string;
  filter_op?: FILTER_OPERATION;
  filter_val?: string | number | Array<string> | Array<number>;
}

export interface QueryParamSorters {
  sort_col?: string;
  sort_order?: SORT_ORDER;
}

export interface QueryParamProccesed {
  filter_cols?: string | number;
  filter_ops?: string | number;
  filter_vals?: string | number;
  children?: string | string[];
  page_num?: number;
  page_size?: number;
  sort_cols?: string;
  sort_col?: string;
  sort_order?: string;
  ds_cols?: string | string[];
  ds_interval?: string;
}

export interface QueryParamV2 {
  activity_id?: string | number;
  surface_report_id?: string | number;
  report_id?: string | number;
}

export enum SORT_ORDER {
  DESCENDING = -1,
  ASCENDING = 1,
}

export type FILTER_OPERATION =
  | "="
  | "!="
  | ">="
  | "<="
  | ">"
  | "<"
  | "IN"
  | "NOT IN";

export interface Meta {
  count: number;
  total_count: number;
  global_count: number;
  fields: any; // Replace with FieldsDetailsResponse when available
  global_time_max: string;
  global_time_min: string;
  time_max: string;
  time_min: string;
}

export enum HTTP_PATH {
  ADD = "add",
  ADD_RECURSIVE = "add_recursive",
  AGGREGATION = "aggregation",
  ALGORITHM = "algorithm",
  EXPORT = "export",
  EXCEL = "excel",
  FIELDS_DETAIL = "fields_detail",
  ID = "id",
  LOGIN = "login",
  PARENT_ENTITY = "parent_entity",
  PARENT_ID = "parent_id",
  REGISTER = "register",
  RUN = "run",
  UPDATE = "update",
  SAVE = "save",
  UPDATE_PASSWORD = "update_password",
  UPLOAD = "upload",
  LAST = "last",
  EMAIL = "email",
  USERS = "users",
  ALL_USERS = "all_users",
  SEND = "send",
  FREE = "free",
  CALCULATE = "calculate",
  COPY = "copy",
  NAME = "name",
}

export enum ALGORITHM {
  GATE_VALVE_LEAK_RATE = "gate_valve_leak_rate",
}

export enum AGGREGATION {
  COMPLIANCE = "compliance",
  HOME_DASHBOARD = "home_dashboard",
  RISK_PER_FIELD_WELLS = "risk_per_field_wells",
  VALVE_FAILURE_RATE = "valve_failure_rate",
}

export enum FUNCTIONALITIES {
  SUMMARIZE = "summarize",
  DATA_ANALYSIS = "data_analysis",
  AGGREGATE_HOURS = "aggregatehours",
  UPDATE_REPORT = "update_report",
  UPLOAD = "upload",
}
