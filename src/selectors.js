/**
 * @file 标准Redux Store结构的相关选择器
 * @author zhanglili
 */

import {createSelector} from 'reselect';

const get = name => source => (source == null ? source : source[name]);

/**
 * 根据`selectParams`返回的参数，从`selectQuery`返回的查询集里找到对应的查询
 *
 * 一个查询包含以下属性：
 *
 * - `{number} pendingMutex`：当前有几个请求正在进行，发起请求时+1，请求响应时-1
 * - `{Object} response`：存储下来的响应
 * - `{Object} nextResponse`：如果使用的策略是不立即用新的响应替换旧的，则会在`nextResponse`中存放最新的响应
 *
 * @param {Function} selectQuery 获取到整个Query集
 * @param {Function} selectParams 获取参数对象
 */
export const createQuerySelector = (selectQuery, selectParams) => createSelector(
    [selectQuery, selectParams],
    (query, params) => {
        const paramsKey = JSON.stringify(params);
        return query[paramsKey];
    }
);

/**
 * 基于`createQuerySelector`再获取查询中的`response`对象
 *
 * 一个响应对象包含以下属性：
 *
 * - `{number} arrivedAt`：响应的到达时间，可用于计算过期等
 * - `{*} data`：如果响应是成功的，则`data`对象存放了具体的响应内容
 * - `{Object} error`：如果响应是失败的，则`error`对象存放了具体的错误信息
 *
 * @param {Function} selectQuery 获取到整个Query集
 * @param {Function} selectParams 获取参数对象
 */
export const createQueryResponseSelector = (selectQuery, selectParams) => createSelector(
    [createQuerySelector(selectQuery, selectParams)],
    get('response')
);

/**
 * 基于`createQueryResponseSelector`再获取查询中的`data`对象
 *
 * @param {Function} selectQuery 获取到整个Query集
 * @param {Function} selectParams 获取参数对象
 */
export const createQueryDataSelector = (selectQuery, selectParams) => createSelector(
    [createQueryResponseSelector(selectQuery, selectParams)],
    get('data')
);

/**
 * 基于`createQueryResponseSelector`再获取查询中的`error`对象
 *
 * @param {Function} selectQuery 获取到整个Query集
 * @param {Function} selectParams 获取参数对象
 */
export const createQueryErrorSelector = (selectQuery, selectParams) => createSelector(
    [createQueryResponseSelector(selectQuery, selectParams)],
    get('error')
);
