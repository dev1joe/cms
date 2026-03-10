import { ApiResponseBody } from "./types"

export class ApiResponseHandler {
  static success<T = []>(
    msg: string,
    data?: T,
  ): ApiResponseBody<T> {
    return {
      success: true,
      message: msg,
      ...(data !== undefined && { result: data })
    }
  }

  static error(
    msg: string,
    errors?: Record<string, string[]>,
  ): ApiResponseBody {
    return {
      success: false,
      message: msg,
      errors
    }
  }

  // static paginated<T>(
  //     data: T[],
  //     page: number,
  //     limit: number,
  //     total: number,
  //     meta?: any
  // ): PaginatedResponse<T> {
  //     const totalPages = Math.ceil(total / limit);

  //     return {
  //         success: true,
  //         data,
  //         meta: {
  //             timestamp: new Date().toISOString(),
  //             ...meta,
  //             pagination: {
  //                 page,
  //                 limit,
  //                 total,
  //                 totalPages,
  //                 hasNext: page < totalPages,
  //                 hasPrev: page > 1,
  //             },
  //         },
  //     };
  // }
}


// /types/api.ts
// export interface ApiResponse {...}
// export interface PaginatedResponse<T> extends ApiResponse<T[]> {
//     meta: {
//         timestamp: string;
//         path?: string;
//         pagination: {
//             page: number;
//             limit: number;
//             total: number;
//             totalPages: number;
//             hasNext: boolean;
//             hasPrev: boolean;
//         };
//     };
// }
