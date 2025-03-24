import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { isArray, omit, isEmpty } from "lodash";
import { ENTITIES } from "../models/entities";
import {
  QueryParams,
  QueryParamFilter,
  QueryParamProccesed,
  QueryParamSorters,
  Meta,
  HTTP_PATH,
} from "../models/api.model";
import { Category } from "../models/category.model";
import UserService from "../services/user.service";
import { Product } from "../models/product.model";

interface Input {
  config: AxiosRequestConfig;
  interceptors?: {
    request?: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
    response?: {
      onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
      onRejected?: (error: AxiosError) => any;
    };
  };
}

interface GetEntityProp {
  entity: ENTITIES;
  params?: QueryParams;
  byIdKey?: string;
}

class ArrayUtil {
  static generateMap<T>(array: T[], key: string): { [key: string]: T } {
    return array.reduce((acc, item) => {
      const itemKey = (item as any)[key];
      if (itemKey) {
        acc[itemKey] = item;
      }
      return acc;
    }, {} as { [key: string]: T });
  }
}

export default class Api {
  public axios: AxiosInstance;
  private static instance: Api;
  private baseURL: string;

  static init({ config, interceptors }: Input) {
    Api.instance = new Api({
      config,
      interceptors,
    });
    return Api.instance;
  }

  constructor({ config, interceptors }: Input) {
    this.axios = axios.create(config);
    this.baseURL = config.baseURL || '';

    if (interceptors?.request) {
      this.axios.interceptors.request.use(interceptors.request);
    }
    if (interceptors?.response) {
      this.axios.interceptors.response.use(
        interceptors.response.onFulfilled,
        interceptors.response.onRejected
      );
    }
  }

  private getAuthHeaders = () => {
    const token = UserService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Basic HTTP methods with optional auth
  public get = <T>(url: string, config?: AxiosRequestConfig) => {
    return this.axios.get<T>(url, config);
  };

  public post = <T>(url: string, payload: any, config?: AxiosRequestConfig) => {
    const headers = {
      ...this.getAuthHeaders(),
      ...(config?.headers || {}),
    };
    return this.axios.post<T>(url, payload, { ...config, headers });
  };

  public put = <T>(url: string, payload: any, config?: AxiosRequestConfig) => {
    const headers = {
      ...this.getAuthHeaders(),
      ...(config?.headers || {}),
    };
    return this.axios.put<T>(url, payload, { ...config, headers });
  };

  public delete = <T>(url: string, config?: AxiosRequestConfig) => {
    const headers = {
      ...this.getAuthHeaders(),
      ...(config?.headers || {}),
    };
    return this.axios.delete<T>(url, { ...config, headers });
  };

  // Generic functions for soukOnline
  public getExistingEntityForSouk = async <T>(
    entity: ENTITIES | string,
    params?: QueryParamProccesed | string
  ) => {
    const response = await this.get<{
      data: Array<T>;
      meta: Meta;
    }>(`${entity}`, {
      params: params,
      baseURL: this.baseURL,
    });
    return {
      ...response?.data,
    };
  };

  public deleteExistingEntityForSouk = async (
    entity: ENTITIES,
    _id: string
  ) => {
    const response = await this.delete<{
      data: any;
      meta: Meta;
    }>(`${entity}/${_id}`, {
      baseURL: this.baseURL,
    });
    return {
      ...response,
    };
  };

  public createNewEntityForSouk = async <T>(entity: ENTITIES, payload: T) => {
    const response = await this.post(`${entity}`, payload, {
      baseURL: this.baseURL,
    });
    return {
      ...response,
    };
  };

  public updateExistingEntityForSouk = async <T>(
    entity: ENTITIES,
    payload: T
  ) => {
    const response = await this.put(`${entity}`, payload, {
      baseURL: this.baseURL,
    });
    return {
      ...response,
    };
  };

  // Parameter processing methods
  private convertArrayToParamsValue = <T>(
    items: Array<T | undefined> | undefined,
    delimiter = '|'
  ) =>
    items?.reduce(
      (acc, c, index) =>
        index === 0 ? `${acc}${c}` : `${acc}${delimiter}${c}`,
      ''
    );

  private processFilterValues = (
    items: Array<string | number> | string | number | undefined
  ) => (isArray(items) ? this.convertArrayToParamsValue(items, ';') : items);

  private processFilters = (
    filter: Array<QueryParamFilter> | undefined
  ): {
    filter_cols?: string | number;
    filter_ops?: string | number;
    filter_vals?: string | number;
  } => {
    if (!filter) return {};

    return filter.reduce(
      (acc, p, index) => {
        const filterValue = this.processFilterValues(p?.filter_val);
        return {
          filter_cols:
            index === 0
              ? `${acc.filter_cols}${p?.filter_col}`
              : `${acc.filter_cols}|${p?.filter_col}`,
          filter_ops:
            index === 0
              ? `${acc.filter_ops}${p?.filter_op}`
              : `${acc.filter_ops}|${p?.filter_op}`,
          filter_vals:
            index === 0
              ? `${acc.filter_vals}${filterValue}`
              : `${acc.filter_vals}|${filterValue}`,
        };
      },
      {
        filter_cols: '',
        filter_ops: '',
        filter_vals: '',
      }
    );
  };

  private processSorters = (sorters: Array<QueryParamSorters> | undefined) => {
    if (!sorters) return {};

    return sorters.reduce(
      (acc, sorter, index) => ({
        sort_col:
          index === 0
            ? `${acc.sort_col}${sorter?.sort_col}`
            : `${acc.sort_col}|${sorter?.sort_col}`,
        sort_order:
          index === 0
            ? `${acc.sort_order}${sorter?.sort_order}`
            : `${acc.sort_order}|${sorter?.sort_order}`,
      }),
      { sort_col: '', sort_order: '' }
    );
  };

  public processParams = (params?: QueryParams): QueryParamProccesed => {
    return {
      ...omit(params, ['filter', 'sorters']),
      children: this.convertArrayToParamsValue(params?.children),
      ds_cols: this.convertArrayToParamsValue(params?.ds_col),
      ...this.processFilters(params?.filter),
      ...this.processSorters(params?.sorters),
    };
  };

  public getEntities = async <T>({
    entity,
    params,
    byIdKey,
  }: GetEntityProp) => {
    const response = await this.get<{
      data: Array<T>;
      meta: Meta;
    }>(entity, { params: this.processParams(params) });

    return {
      ...response,
      data: {
        ...response?.data,
        byId: byIdKey
          ? ArrayUtil.generateMap<T>(response?.data?.data, byIdKey)
          : undefined,
      },
    };
  };

  public getEntity = <T>(entity: ENTITIES, id: string) => {
    return this.get<{
      data: T;
      meta: Meta;
    }>(`${entity}/${HTTP_PATH.ID}/${id}`);
  };

  public createEntity = <T>(entity: ENTITIES, payload: T) => {
    return this.post<T>(`${entity}/${HTTP_PATH.ADD}`, payload);
  };

  public uploadEntity = (entity: ENTITIES, formData: FormData) => {
    return this.post(`${entity}/${HTTP_PATH.UPLOAD}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  public createEntityRecursive = <T>(entity: ENTITIES, payload: T) => {
    return this.post<T>(`${entity}/${HTTP_PATH.ADD_RECURSIVE}`, payload);
  };

  // Product Methods
  public getProducts = async <T>() => {
    const { data } = await this.get<Product[]>(ENTITIES.ALL_PRODUCTS);
    return data;
  };

  public createProduct = async (payload: Product) => {
    const response = await this.createNewEntityForSouk<Product>(
      ENTITIES.CREATE_PRODUCT,
      payload
    );
    return response?.data;
  };

  public deleteProduct = async (payload: { productId: string }) => {
    const { data } = await this.post<{ message: string }>(
      `${ENTITIES.DELETE_PRODUCT}`,
      payload
    );
    return data;
  };

  public updateProduct = async (payload: Product) => {
    const response = await this.updateExistingEntityForSouk<Product>(
      ENTITIES.UPDATE_PRODUCT,
      payload
    );
    return response?.data;
  };

  public bulkDeleteProducts = async (productIds: string[]) => {
    const { data } = await this.post<{ message: string }>(
      `${ENTITIES.DELETE_PRODUCT}`,
      { productId: productIds[0] }
    );
    return data;
  };

  // Categories
  // Note To Rachid : when you want to make Crud operation you must start from here  copy these 4 and change their names
  // change their ENTITIES and create interface like here i have Category interface then go and create query  on queries folder

  public getCategories = async () => {
    const { data } = await this.get<Category[]>(ENTITIES.ALL_CATEGORIES);
    return data;
  };

  public createCategory = async (payload: Category) => {
    const response = await this.createNewEntityForSouk<Category>(
      ENTITIES.ADD_CATEGORY,
      payload
    );
    return response?.data;
  };

  public deleteCategory = async (payload: { categoryId: string }) => {
    const { data } = await this.post<{ message: string }>(
      `${ENTITIES.DELETE_CATEGORY}`,
      payload
    );
    return data;
  };

  public updateCategory = async (payload: Category) => {
    const response = await this.updateExistingEntityForSouk<Category>(
      ENTITIES.UPDATE_CATEGORY,
      payload
    );
    return response?.data;
  };

  public bulkDeleteCategories = async (categoryIds: string[]) => {
    const { data } = await this.post<{ message: string }>(
      `${ENTITIES.DELETE_CATEGORY}`,
      { categoryId: categoryIds[0] }
    );
    return data;
  };
}
