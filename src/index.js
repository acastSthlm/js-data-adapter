import {Component, utils} from 'js-data'

export const noop = function (...args) {
  const opts = args[args.length - 1]
  this.dbg(opts.op, ...args)
  return utils.resolve()
}

export const noop2 = function (...args) {
  const opts = args[args.length - 2]
  this.dbg(opts.op, ...args)
  return utils.resolve()
}

export const unique = function (array) {
  const seen = {}
  const final = []
  array.forEach(function (item) {
    if (item in seen) {
      return
    }
    final.push(item)
    seen[item] = 0
  })
  return final
}

export const withoutRelations = function (mapper, props, opts) {
  opts || (opts = {})
  opts.with || (opts.with = [])
  const relationFields = mapper.relationFields || []
  const toStrip = relationFields.filter((value) => opts.with.indexOf(value) === -1)
  return utils.omit(props, toStrip)
}

export const reserved = [
  'orderBy',
  'sort',
  'limit',
  'offset',
  'skip',
  'where'
]

/**
 * Response object used when `raw` is `true`. May contain other fields in
 * addition to `data`.
 *
 * @class Response
 */
export function Response (data, meta, op) {
  meta || (meta = {})

  /**
   * Response data.
   *
   * @name Response#data
   * @type {*}
   */
  this.data = data

  utils.fillIn(this, meta)

  /**
   * The operation for which the response was created.
   *
   * @name Response#op
   * @type {string}
   */
  this.op = op
}

const DEFAULTS = {
  /**
   * Whether to log debugging information.
   *
   * @name Adapter#debug
   * @type {boolean}
   * @default false
   */
  debug: false,

  /**
   * Whether to return a more detailed response object.
   *
   * @name Adapter#raw
   * @type {boolean}
   * @default false
   */
  raw: false
}

/**
 * Abstract class meant to be extended by adapters.
 *
 * @class Adapter
 * @abstract
 * @extends Component
 * @param {Object} [opts] Configuration opts.
 * @param {boolean} [opts.debug=false] Whether to log debugging information.
 * @param {boolean} [opts.raw=false] Whether to return a more detailed response
 * object.
 */
export function Adapter (opts) {
  utils.classCallCheck(this, Adapter)
  Component.call(this, opts)
  opts || (opts = {})
  utils.fillIn(opts, DEFAULTS)
  utils.fillIn(this, opts)
}

Component.extend({
  constructor: Adapter,

  /**
   * Lifecycle method method called by <a href="#count__anchor">count</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#count__anchor">count</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the count.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#count__anchor">count</a>.
   *
   * @name Adapter#afterCount
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#count__anchor">count</a>.
   * @param {Object} props The `props` argument passed to <a href="#count__anchor">count</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#count__anchor">count</a>.
   * @property {string} opts.op `afterCount`
   * @param {Object|Response} response Count or {@link Response}, depending on the value of `opts.raw`.
   */
  afterCount: noop2,

  /**
   * Lifecycle method method called by <a href="#create__anchor">create</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#create__anchor">create</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the created record.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#create__anchor">create</a>.
   *
   * @name Adapter#afterCreate
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#create__anchor">create</a>.
   * @param {Object} props The `props` argument passed to <a href="#create__anchor">create</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#create__anchor">create</a>.
   * @property {string} opts.op `afterCreate`
   * @param {Object|Response} response Created record or {@link Response}, depending on the value of `opts.raw`.
   */
  afterCreate: noop2,

  /**
   * Lifecycle method method called by <a href="#createMany__anchor">createMany</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#createMany__anchor">createMany</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the created records.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#createMany__anchor">createMany</a>.
   *
   * @name Adapter#afterCreate
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#createMany__anchor">createMany</a>.
   * @param {Object[]} props The `props` argument passed to <a href="#createMany__anchor">createMany</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#createMany__anchor">createMany</a>.
   * @property {string} opts.op `afterCreateMany`
   * @param {Object[]|Response} response Created records or {@link Response}, depending on the value of `opts.raw`.
   */
  afterCreateMany: noop2,

  /**
   * Lifecycle method method called by <a href="#destroy__anchor">destroy</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#destroy__anchor">destroy</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be `undefined`.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#destroy__anchor">destroy</a>.
   *
   * @name Adapter#afterDestroy
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#destroy__anchor">destroy</a>.
   * @param {(string|number)} id The `id` argument passed to <a href="#destroy__anchor">destroy</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#destroy__anchor">destroy</a>.
   * @property {string} opts.op `afterDestroy`
   * @param {undefined|Response} response `undefined` or {@link Response}, depending on the value of `opts.raw`.
   */
  afterDestroy: noop2,

  /**
   * Lifecycle method method called by <a href="#destroyAll__anchor">destroyAll</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#destroyAll__anchor">destroyAll</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be `undefined`.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#destroyAll__anchor">destroyAll</a>.
   *
   * @name Adapter#afterDestroyAll
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#destroyAll__anchor">destroyAll</a>.
   * @param {Object} query The `query` argument passed to <a href="#destroyAll__anchor">destroyAll</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#destroyAll__anchor">destroyAll</a>.
   * @property {string} opts.op `afterDestroyAll`
   * @param {undefined|Response} response `undefined` or {@link Response}, depending on the value of `opts.raw`.
   */
  afterDestroyAll: noop2,

  /**
   * Lifecycle method method called by <a href="#find__anchor">find</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#find__anchor">find</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the found record, if any.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#find__anchor">find</a>.
   *
   * @name Adapter#afterFind
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#find__anchor">find</a>.
   * @param {(string|number)} id The `id` argument passed to <a href="#find__anchor">find</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#find__anchor">find</a>.
   * @property {string} opts.op `afterFind`
   * @param {Object|Response} response The found record or {@link Response}, depending on the value of `opts.raw`.
   */
  afterFind: noop2,

  /**
   * Lifecycle method method called by <a href="#findAll__anchor">findAll</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#findAll__anchor">findAll</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the found records, if any.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#findAll__anchor">findAll</a>.
   *
   * @name Adapter#afterFindAll
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#findAll__anchor">findAll</a>.
   * @param {Object} query The `query` argument passed to <a href="#findAll__anchor">findAll</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#findAll__anchor">findAll</a>.
   * @property {string} opts.op `afterFindAll`
   * @param {Object[]|Response} response The found records or {@link Response}, depending on the value of `opts.raw`.
   */
  afterFindAll: noop2,

  /**
   * Lifecycle method method called by <a href="#sum__anchor">sum</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#sum__anchor">sum</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the sum.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#sum__anchor">sum</a>.
   *
   * @name Adapter#afterSum
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#sum__anchor">sum</a>.
   * @param {string} field The `field` argument passed to <a href="#sum__anchor">sum</a>.
   * @param {Object} query The `query` argument passed to <a href="#sum__anchor">sum</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#sum__anchor">sum</a>.
   * @property {string} opts.op `afterSum`
   * @param {Object|Response} response Count or {@link Response}, depending on the value of `opts.raw`.
   */
  afterSum: noop2,

  /**
   * Lifecycle method method called by <a href="#update__anchor">update</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#update__anchor">update</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the updated record.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#update__anchor">update</a>.
   *
   * @name Adapter#afterUpdate
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#update__anchor">update</a>.
   * @param {(string|number)} id The `id` argument passed to <a href="#update__anchor">update</a>.
   * @param {Object} props The `props` argument passed to <a href="#update__anchor">update</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#update__anchor">update</a>.
   * @property {string} opts.op `afterUpdate`
   * @param {Object|Response} response The updated record or {@link Response}, depending on the value of `opts.raw`.
   */
  afterUpdate: noop2,

  /**
   * Lifecycle method method called by <a href="#updateAll__anchor">updateAll</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#updateAll__anchor">updateAll</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the updated records, if any.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#updateAll__anchor">updateAll</a>.
   *
   * @name Adapter#afterUpdateAll
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @param {Object} props The `props` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @param {Object} query The `query` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @property {string} opts.op `afterUpdateAll`
   * @param {Object[]|Response} response The updated records or {@link Response}, depending on the value of `opts.raw`.
   */
  afterUpdateAll: noop2,

  /**
   * Lifecycle method method called by <a href="#updateMany__anchor">updateMany</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#updateMany__anchor">updateMany</a> to wait for the Promise to resolve before continuing.
   *
   * If `opts.raw` is `true` then `response` will be a detailed response object, otherwise `response` will be the updated records, if any.
   *
   * `response` may be modified. You can also re-assign `response` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#updateMany__anchor">updateMany</a>.
   *
   * @name Adapter#afterUpdateMany
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#updateMany__anchor">updateMany</a>.
   * @param {Object[]} records The `records` argument passed to <a href="#updateMany__anchor">updateMany</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#updateMany__anchor">updateMany</a>.
   * @property {string} opts.op `afterUpdateMany`
   * @param {Object[]|Response} response The updated records or {@link Response}, depending on the value of `opts.raw`.
   */
  afterUpdateMany: noop2,

  /**
   * Lifecycle method method called by <a href="#count__anchor">count</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#count__anchor">count</a> to wait for the Promise to resolve before continuing.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#count__anchor">count</a>.
   *
   * @name Adapter#beforeCount
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#count__anchor">count</a>.
   * @param {Object} query The `query` argument passed to <a href="#count__anchor">count</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#count__anchor">count</a>.
   * @property {string} opts.op `beforeCount`
   */
  beforeCount: noop,

  /**
   * Lifecycle method method called by <a href="#create__anchor">create</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#create__anchor">create</a> to wait for the Promise to resolve before continuing.
   *
   * `props` may be modified. You can also re-assign `props` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#create__anchor">create</a>.
   *
   * @name Adapter#beforeCreate
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#create__anchor">create</a>.
   * @param {Object} props The `props` argument passed to <a href="#create__anchor">create</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#create__anchor">create</a>.
   * @property {string} opts.op `beforeCreate`
   */
  beforeCreate: noop,

  /**
   * Lifecycle method method called by <a href="#createMany__anchor">createMany</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#createMany__anchor">createMany</a> to wait for the Promise to resolve before continuing.
   *
   * `props` may be modified. You can also re-assign `props` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#createMany__anchor">createMany</a>.
   *
   * @name Adapter#beforeCreateMany
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#createMany__anchor">createMany</a>.
   * @param {Object[]} props The `props` argument passed to <a href="#createMany__anchor">createMany</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#createMany__anchor">createMany</a>.
   * @property {string} opts.op `beforeCreateMany`
   */
  beforeCreateMany: noop,

  /**
   * Lifecycle method method called by <a href="#destroy__anchor">destroy</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#destroy__anchor">destroy</a> to wait for the Promise to resolve before continuing.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#destroy__anchor">destroy</a>.
   *
   * @name Adapter#beforeDestroy
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#destroy__anchor">destroy</a>.
   * @param {(string|number)} id The `id` argument passed to <a href="#destroy__anchor">destroy</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#destroy__anchor">destroy</a>.
   * @property {string} opts.op `beforeDestroy`
   */
  beforeDestroy: noop,

  /**
   * Lifecycle method method called by <a href="#destroyAll__anchor">destroyAll</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#destroyAll__anchor">destroyAll</a> to wait for the Promise to resolve before continuing.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#destroyAll__anchor">destroyAll</a>.
   *
   * @name Adapter#beforeDestroyAll
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#destroyAll__anchor">destroyAll</a>.
   * @param {Object} query The `query` argument passed to <a href="#destroyAll__anchor">destroyAll</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#destroyAll__anchor">destroyAll</a>.
   * @property {string} opts.op `beforeDestroyAll`
   */
  beforeDestroyAll: noop,

  /**
   * Lifecycle method method called by <a href="#find__anchor">find</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#find__anchor">find</a> to wait for the Promise to resolve before continuing.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#find__anchor">find</a>.
   *
   * @name Adapter#beforeFind
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#find__anchor">find</a>.
   * @param {(string|number)} id The `id` argument passed to <a href="#find__anchor">find</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#find__anchor">find</a>.
   * @property {string} opts.op `beforeFind`
   */
  beforeFind: noop,

  /**
   * Lifecycle method method called by <a href="#findAll__anchor">findAll</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#findAll__anchor">findAll</a> to wait for the Promise to resolve before continuing.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#findAll__anchor">findAll</a>.
   *
   * @name Adapter#beforeFindAll
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#findAll__anchor">findAll</a>.
   * @param {Object} query The `query` argument passed to <a href="#findAll__anchor">findAll</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#findAll__anchor">findAll</a>.
   * @property {string} opts.op `beforeFindAll`
   */
  beforeFindAll: noop,

  /**
   * Lifecycle method method called by <a href="#sum__anchor">sum</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#sum__anchor">sum</a> to wait for the Promise to resolve before continuing.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#sum__anchor">sum</a>.
   *
   * @name Adapter#beforeSum
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#sum__anchor">sum</a>.
   * @param {Object} query The `query` argument passed to <a href="#sum__anchor">sum</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#sum__anchor">sum</a>.
   * @property {string} opts.op `beforeSum`
   */
  beforeSum: noop,

  /**
   * Lifecycle method method called by <a href="#update__anchor">update</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#update__anchor">update</a> to wait for the Promise to resolve before continuing.
   *
   * `props` may be modified. You can also re-assign `props` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#update__anchor">update</a>.
   *
   * @name Adapter#beforeUpdate
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#update__anchor">update</a>.
   * @param {(string|number)} id The `id` argument passed to <a href="#update__anchor">update</a>.
   * @param {Object} props The `props` argument passed to <a href="#update__anchor">update</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#update__anchor">update</a>.
   * @property {string} opts.op `beforeUpdate`
   */
  beforeUpdate: noop,

  /**
   * Lifecycle method method called by <a href="#updateAll__anchor">updateAll</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#updateAll__anchor">updateAll</a> to wait for the Promise to resolve before continuing.
   *
   * `props` may be modified. You can also re-assign `props` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#updateAll__anchor">updateAll</a>.
   *
   * @name Adapter#beforeUpdateAll
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @param {Object} props The `props` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @param {Object} query The `query` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#updateAll__anchor">updateAll</a>.
   * @property {string} opts.op `beforeUpdateAll`
   */
  beforeUpdateAll: noop,

  /**
   * Lifecycle method method called by <a href="#updateMany__anchor">updateMany</a>.
   *
   * Override this method to add custom behavior for this lifecycle hook.
   *
   * Returning a Promise causes <a href="#updateMany__anchor">updateMany</a> to wait for the Promise to resolve before continuing.
   *
   * `props` may be modified. You can also re-assign `props` to another value by returning a different value or a Promise that resolves to a different value.
   *
   * A thrown error or rejected Promise will bubble up and reject the Promise returned by <a href="#updateMany__anchor">updateMany</a>.
   *
   * @name Adapter#beforeUpdateMany
   * @method
   * @param {Object} mapper The `mapper` argument passed to <a href="#updateMany__anchor">updateMany</a>.
   * @param {Object[]} props The `props` argument passed to <a href="#updateMany__anchor">updateMany</a>.
   * @param {Object} opts The `opts` argument passed to <a href="#updateMany__anchor">updateMany</a>.
   * @property {string} opts.op `beforeUpdateMany`
   */
  beforeUpdateMany: noop,

  /**
   * Retrieve the number of records that match the selection query. Called by
   * `Mapper#count`.
   *
   * @name Adapter#count
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} [query] Selection query.
   * @param {Object} [query.where] Filtering criteria.
   * @param {string|Array} [query.orderBy] Sorting criteria.
   * @param {string|Array} [query.sort] Same as `query.sort`.
   * @param {number} [query.limit] Limit results.
   * @param {number} [query.skip] Offset results.
   * @param {number} [query.offset] Same as `query.skip`.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  count (mapper, query, opts) {
    let op
    query || (query = {})
    opts || (opts = {})

    // beforeCount lifecycle hook
    op = opts.op = 'beforeCount'
    return utils.resolve(this[op](mapper, query, opts))
      .then(() => {
        // Allow for re-assignment from lifecycle hook
        op = opts.op = 'count'
        this.dbg(op, mapper, query, opts)
        return utils.resolve(this._count(mapper, query, opts))
      })
      .then((results) => {
        let [data, result] = results
        result || (result = {})
        let response = new Response(data, result, op)
        response = this.respond(response, opts)

        // afterCount lifecycle hook
        op = opts.op = 'afterCount'
        return utils.resolve(this[op](mapper, query, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Create a new record. Called by `Mapper#create`.
   *
   * @name Adapter#create
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The record to be created.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  create (mapper, props, opts) {
    let op
    props || (props = {})
    opts || (opts = {})

    // beforeCreate lifecycle hook
    op = opts.op = 'beforeCreate'
    return utils.resolve(this[op](mapper, props, opts))
      .then((_props) => {
        // Allow for re-assignment from lifecycle hook
        props = _props === undefined ? props : _props
        props = withoutRelations(mapper, props, opts)
        op = opts.op = 'create'
        this.dbg(op, mapper, props, opts)
        return utils.resolve(this._create(mapper, props, opts))
      })
      .then((results) => {
        let [data, result] = results
        result || (result = {})
        let response = new Response(data, result, 'create')
        response.created = data ? 1 : 0
        response = this.respond(response, opts)

        // afterCreate lifecycle hook
        op = opts.op = 'afterCreate'
        return utils.resolve(this[op](mapper, props, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Create multiple records in a single batch. Called by `Mapper#createMany`.
   *
   * @name Adapter#createMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The records to be created.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  createMany (mapper, props, opts) {
    let op
    props || (props = {})
    opts || (opts = {})

    // beforeCreateMany lifecycle hook
    op = opts.op = 'beforeCreateMany'
    return utils.resolve(this[op](mapper, props, opts))
      .then((_props) => {
        // Allow for re-assignment from lifecycle hook
        props = _props === undefined ? props : _props
        props = props.map((record) => withoutRelations(mapper, record, opts))
        op = opts.op = 'createMany'
        this.dbg(op, mapper, props, opts)
        return utils.resolve(this._createMany(mapper, props, opts))
      })
      .then((results) => {
        let [data, result] = results
        data || (data = [])
        result || (result = {})
        let response = new Response(data, result, 'createMany')
        response.created = data.length
        response = this.respond(response, opts)

        // afterCreateMany lifecycle hook
        op = opts.op = 'afterCreateMany'
        return utils.resolve(this[op](mapper, props, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Destroy the record with the given primary key. Called by
   * `Mapper#destroy`.
   *
   * @name Adapter#destroy
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to destroy.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  destroy (mapper, id, opts) {
    let op
    opts || (opts = {})

    // beforeDestroy lifecycle hook
    op = opts.op = 'beforeDestroy'
    return utils.resolve(this[op](mapper, id, opts))
      .then(() => {
        op = opts.op = 'destroy'
        this.dbg(op, mapper, id, opts)
        return utils.resolve(this._destroy(mapper, id, opts))
      })
      .then((results) => {
        let [data, result] = results
        result || (result = {})
        let response = new Response(data, result, 'destroy')
        response = this.respond(response, opts)

        // afterDestroy lifecycle hook
        op = opts.op = 'afterDestroy'
        return utils.resolve(this[op](mapper, id, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Destroy the records that match the selection query. Called by
   * `Mapper#destroyAll`.
   *
   * @name Adapter#destroyAll
   * @method
   * @param {Object} mapper the mapper.
   * @param {Object} [query] Selection query.
   * @param {Object} [query.where] Filtering criteria.
   * @param {string|Array} [query.orderBy] Sorting criteria.
   * @param {string|Array} [query.sort] Same as `query.sort`.
   * @param {number} [query.limit] Limit results.
   * @param {number} [query.skip] Offset results.
   * @param {number} [query.offset] Same as `query.skip`.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  destroyAll (mapper, query, opts) {
    let op
    query || (query = {})
    opts || (opts = {})

    // beforeDestroyAll lifecycle hook
    op = opts.op = 'beforeDestroyAll'
    return utils.resolve(this[op](mapper, query, opts))
      .then(() => {
        op = opts.op = 'destroyAll'
        this.dbg(op, mapper, query, opts)
        return utils.resolve(this._destroyAll(mapper, query, opts))
      })
      .then((results) => {
        let [data, result] = results
        result || (result = {})
        let response = new Response(data, result, 'destroyAll')
        response = this.respond(response, opts)

        // afterDestroyAll lifecycle hook
        op = opts.op = 'afterDestroyAll'
        return utils.resolve(this[op](mapper, query, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Load a belongsTo relationship.
   *
   * Override with care.
   *
   * @name Adapter#loadBelongsTo
   * @method
   * @return {Promise}
   */
  loadBelongsTo (mapper, def, records, __opts) {
    const relationDef = def.getRelation()

    if (utils.isObject(records) && !utils.isArray(records)) {
      const record = records
      return this.find(relationDef, this.makeBelongsToForeignKey(mapper, def, record), __opts)
        .then((relatedItem) => {
          def.setLocalField(record, relatedItem)
        })
    } else {
      const keys = records
        .map((record) => this.makeBelongsToForeignKey(mapper, def, record))
        .filter((key) => key)
      return this.findAll(relationDef, {
        where: {
          [relationDef.idAttribute]: {
            'in': keys
          }
        }
      }, __opts).then((relatedItems) => {
        records.forEach((record) => {
          relatedItems.forEach((relatedItem) => {
            if (relatedItem[relationDef.idAttribute] === record[def.foreignKey]) {
              def.setLocalField(record, relatedItem)
            }
          })
        })
      })
    }
  },

  /**
   * Retrieve the record with the given primary key. Called by `Mapper#find`.
   *
   * @name Adapter#find
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to retrieve.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {string[]} [opts.with=[]] Relations to eager load.
   * @return {Promise}
   */
  find (mapper, id, opts) {
    let record, op
    let meta = {}
    opts || (opts = {})
    opts.with || (opts.with = [])

    // beforeFind lifecycle hook
    op = opts.op = 'beforeFind'
    return utils.resolve(this[op](mapper, id, opts))
      .then(() => {
        op = opts.op = 'find'
        this.dbg(op, mapper, id, opts)
        return utils.resolve(this._find(mapper, id, opts))
      })
      .then((results) => {
        let [_record, _meta] = results
        if (!_record) {
          return
        }
        record = _record
        meta = _meta
        const tasks = []

        utils.forEachRelation(mapper, opts, (def, __opts) => {
          let task
          if (def.foreignKey && (def.type === 'hasOne' || def.type === 'hasMany')) {
            if (def.type === 'hasOne') {
              task = this.loadHasOne(mapper, def, record, __opts)
            } else {
              task = this.loadHasMany(mapper, def, record, __opts)
            }
          } else if (def.type === 'hasMany' && def.localKeys) {
            task = this.loadHasManyLocalKeys(mapper, def, record, __opts)
          } else if (def.type === 'hasMany' && def.foreignKeys) {
            task = this.loadHasManyForeignKeys(mapper, def, record, __opts)
          } else if (def.type === 'belongsTo') {
            task = this.loadBelongsTo(mapper, def, record, __opts)
          }
          if (task) {
            tasks.push(task)
          }
        })

        return utils.Promise.all(tasks)
      })
      .then(() => {
        let response = new Response(record, meta, 'find')
        response.found = record ? 1 : 0
        response = this.respond(response, opts)

        // afterFind lifecycle hook
        op = opts.op = 'afterFind'
        return utils.resolve(this[op](mapper, id, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Retrieve the records that match the selection query.
   *
   * @name Adapter#findAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} [query] Selection query.
   * @param {Object} [query.where] Filtering criteria.
   * @param {string|Array} [query.orderBy] Sorting criteria.
   * @param {string|Array} [query.sort] Same as `query.sort`.
   * @param {number} [query.limit] Limit results.
   * @param {number} [query.skip] Offset results.
   * @param {number} [query.offset] Same as `query.skip`.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {string[]} [opts.with=[]] Relations to eager load.
   * @return {Promise}
   */
  findAll (mapper, query, opts) {
    opts || (opts = {})
    opts.with || (opts.with = [])

    let records = []
    let meta = {}
    let op
    const activeWith = opts._activeWith

    if (utils.isObject(activeWith)) {
      const activeQuery = activeWith.query || {}
      if (activeWith.replace) {
        query = activeQuery
      } else {
        utils.deepFillIn(query, activeQuery)
      }
    }

    // beforeFindAll lifecycle hook
    op = opts.op = 'beforeFindAll'
    return utils.resolve(this[op](mapper, query, opts))
      .then(() => {
        op = opts.op = 'findAll'
        this.dbg(op, mapper, query, opts)
        return utils.resolve(this._findAll(mapper, query, opts))
      })
      .then((results) => {
        let [_records, _meta] = results
        _records || (_records = [])
        records = _records
        meta = _meta
        const tasks = []
        utils.forEachRelation(mapper, opts, (def, __opts) => {
          let task
          if (def.foreignKey && (def.type === 'hasOne' || def.type === 'hasMany')) {
            if (def.type === 'hasMany') {
              task = this.loadHasMany(mapper, def, records, __opts)
            } else {
              task = this.loadHasOne(mapper, def, records, __opts)
            }
          } else if (def.type === 'hasMany' && def.localKeys) {
            task = this.loadHasManyLocalKeys(mapper, def, records, __opts)
          } else if (def.type === 'hasMany' && def.foreignKeys) {
            task = this.loadHasManyForeignKeys(mapper, def, records, __opts)
          } else if (def.type === 'belongsTo') {
            task = this.loadBelongsTo(mapper, def, records, __opts)
          }
          if (task) {
            tasks.push(task)
          }
        })
        return utils.Promise.all(tasks)
      })
      .then(() => {
        let response = new Response(records, meta, 'findAll')
        response.found = records.length
        response = this.respond(response, opts)

        // afterFindAll lifecycle hook
        op = opts.op = 'afterFindAll'
        return utils.resolve(this[op](mapper, query, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Resolve the value of the specified option based on the given options and
   * this adapter's settings. Override with care.
   *
   * @name Adapter#getOpt
   * @method
   * @param {string} opt The name of the option.
   * @param {Object} [opts] Configuration options.
   * @return {*} The value of the specified option.
   */
  getOpt (opt, opts) {
    opts || (opts = {})
    return opts[opt] === undefined ? utils.plainCopy(this[opt]) : utils.plainCopy(opts[opt])
  },

  /**
   * Load a hasMany relationship.
   *
   * Override with care.
   *
   * @name Adapter#loadHasMany
   * @method
   * @return {Promise}
   */
  loadHasMany (mapper, def, records, __opts) {
    let singular = false

    if (utils.isObject(records) && !utils.isArray(records)) {
      singular = true
      records = [records]
    }
    const IDs = records.map((record) => this.makeHasManyForeignKey(mapper, def, record))
    const query = {
      where: {}
    }
    const criteria = query.where[def.foreignKey] = {}
    if (singular) {
      // more efficient query when we only have one record
      criteria['=='] = IDs[0]
    } else {
      criteria['in'] = IDs.filter((id) => id)
    }
    return this.findAll(def.getRelation(), query, __opts).then((relatedItems) => {
      records.forEach((record) => {
        let attached = []
        // avoid unneccesary iteration when we only have one record
        if (singular) {
          attached = relatedItems
        } else {
          relatedItems.forEach((relatedItem) => {
            if (utils.get(relatedItem, def.foreignKey) === record[mapper.idAttribute]) {
              attached.push(relatedItem)
            }
          })
        }
        def.setLocalField(record, attached)
      })
    })
  },

  loadHasManyLocalKeys (mapper, def, records, __opts) {
    let record
    const relatedMapper = def.getRelation()

    if (utils.isObject(records) && !utils.isArray(records)) {
      record = records
    }

    if (record) {
      return this.findAll(relatedMapper, {
        where: {
          [relatedMapper.idAttribute]: {
            'in': this.makeHasManyLocalKeys(mapper, def, record)
          }
        }
      }, __opts).then((relatedItems) => {
        def.setLocalField(record, relatedItems)
      })
    } else {
      let localKeys = []
      records.forEach((record) => {
        localKeys = localKeys.concat(this.makeHasManyLocalKeys(mapper, def, record))
      })
      return this.findAll(relatedMapper, {
        where: {
          [relatedMapper.idAttribute]: {
            'in': unique(localKeys).filter((x) => x)
          }
        }
      }, __opts).then((relatedItems) => {
        records.forEach((item) => {
          let attached = []
          let itemKeys = utils.get(item, def.localKeys) || []
          itemKeys = utils.isArray(itemKeys) ? itemKeys : Object.keys(itemKeys)
          relatedItems.forEach((relatedItem) => {
            if (itemKeys && itemKeys.indexOf(relatedItem[relatedMapper.idAttribute]) !== -1) {
              attached.push(relatedItem)
            }
          })
          def.setLocalField(item, attached)
        })
        return relatedItems
      })
    }
  },

  loadHasManyForeignKeys (mapper, def, records, __opts) {
    const relatedMapper = def.getRelation()
    const idAttribute = mapper.idAttribute
    let record

    if (utils.isObject(records) && !utils.isArray(records)) {
      record = records
    }

    if (record) {
      return this.findAll(def.getRelation(), {
        where: {
          [def.foreignKeys]: {
            'contains': this.makeHasManyForeignKeys(mapper, def, record)
          }
        }
      }, __opts).then((relatedItems) => {
        def.setLocalField(record, relatedItems)
      })
    } else {
      return this.findAll(relatedMapper, {
        where: {
          [def.foreignKeys]: {
            'isectNotEmpty': records.map((record) => this.makeHasManyForeignKeys(mapper, def, record))
          }
        }
      }, __opts).then((relatedItems) => {
        const foreignKeysField = def.foreignKeys
        records.forEach((record) => {
          const _relatedItems = []
          const id = utils.get(record, idAttribute)
          relatedItems.forEach((relatedItem) => {
            const foreignKeys = utils.get(relatedItems, foreignKeysField) || []
            if (foreignKeys.indexOf(id) !== -1) {
              _relatedItems.push(relatedItem)
            }
          })
          def.setLocalField(record, _relatedItems)
        })
      })
    }
  },

  /**
   * Load a hasOne relationship.
   *
   * Override with care.
   *
   * @name Adapter#loadHasOne
   * @method
   * @return {Promise}
   */
  loadHasOne (mapper, def, records, __opts) {
    if (utils.isObject(records) && !utils.isArray(records)) {
      records = [records]
    }
    return this.loadHasMany(mapper, def, records, __opts).then(() => {
      records.forEach((record) => {
        const relatedData = def.getLocalField(record)
        if (utils.isArray(relatedData) && relatedData.length) {
          def.setLocalField(record, relatedData[0])
        }
      })
    })
  },

  /**
   * Return the foreignKey from the given record for the provided relationship.
   *
   * There may be reasons why you may want to override this method, like when
   * the id of the parent doesn't exactly match up to the key on the child.
   *
   * Override with care.
   *
   * @name Adapter#makeHasManyForeignKey
   * @method
   * @return {*}
   */
  makeHasManyForeignKey (mapper, def, record) {
    return def.getForeignKey(record)
  },

  /**
   * Return the localKeys from the given record for the provided relationship.
   *
   * Override with care.
   *
   * @name Adapter#makeHasManyLocalKeys
   * @method
   * @return {*}
   */
  makeHasManyLocalKeys (mapper, def, record) {
    let localKeys = []
    let itemKeys = utils.get(record, def.localKeys) || []
    itemKeys = utils.isArray(itemKeys) ? itemKeys : Object.keys(itemKeys)
    localKeys = localKeys.concat(itemKeys)
    return unique(localKeys).filter((x) => x)
  },

  /**
   * Return the foreignKeys from the given record for the provided relationship.
   *
   * Override with care.
   *
   * @name Adapter#makeHasManyForeignKeys
   * @method
   * @return {*}
   */
  makeHasManyForeignKeys (mapper, def, record) {
    return utils.get(record, mapper.idAttribute)
  },

  /**
   * Return the foreignKey from the given record for the provided relationship.
   *
   * Override with care.
   *
   * @name Adapter#makeBelongsToForeignKey
   * @method
   * @return {*}
   */
  makeBelongsToForeignKey (mapper, def, record) {
    return def.getForeignKey(record)
  },

  /**
   * Retrieve sum of the specified field of the records that match the selection
   * query. Called by `Mapper#sum`.
   *
   * @name Adapter#sum
   * @method
   * @param {Object} mapper The mapper.
   * @param {string} field By to sum.
   * @param {Object} [query] Selection query.
   * @param {Object} [query.where] Filtering criteria.
   * @param {string|Array} [query.orderBy] Sorting criteria.
   * @param {string|Array} [query.sort] Same as `query.sort`.
   * @param {number} [query.limit] Limit results.
   * @param {number} [query.skip] Offset results.
   * @param {number} [query.offset] Same as `query.skip`.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  sum (mapper, field, query, opts) {
    let op
    if (!utils.isString(field)) {
      throw new Error('field must be a string!')
    }
    query || (query = {})
    opts || (opts = {})

    // beforeSum lifecycle hook
    op = opts.op = 'beforeSum'
    return utils.resolve(this[op](mapper, field, query, opts))
      .then(() => {
        // Allow for re-assignment from lifecycle hook
        op = opts.op = 'sum'
        this.dbg(op, mapper, field, query, opts)
        return utils.resolve(this._sum(mapper, field, query, opts))
      })
      .then((results) => {
        let [data, result] = results
        result || (result = {})
        let response = new Response(data, result, op)
        response = this.respond(response, opts)

        // afterSum lifecycle hook
        op = opts.op = 'afterSum'
        return utils.resolve(this[op](mapper, field, query, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * @name Adapter#respond
   * @method
   * @param {Object} response Response object.
   * @param {Object} opts Configuration options.
   * return {Object} If `opts.raw == true` then return `response`, else return
   * `response.data`.
   */
  respond (response, opts) {
    return this.getOpt('raw', opts) ? response : response.data
  },

  /**
   * Apply the given update to the record with the specified primary key. Called
   * by `Mapper#update`.
   *
   * @name Adapter#update
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id The primary key of the record to be updated.
   * @param {Object} props The update to apply to the record.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  update (mapper, id, props, opts) {
    props || (props = {})
    opts || (opts = {})
    let op

    // beforeUpdate lifecycle hook
    op = opts.op = 'beforeUpdate'
    return utils.resolve(this[op](mapper, id, props, opts))
      .then((_props) => {
        // Allow for re-assignment from lifecycle hook
        props = _props === undefined ? props : _props
        props = withoutRelations(mapper, props, opts)
        op = opts.op = 'update'
        this.dbg(op, mapper, id, props, opts)
        return utils.resolve(this._update(mapper, id, props, opts))
      })
      .then((results) => {
        let [data, result] = results
        result || (result = {})
        let response = new Response(data, result, 'update')
        response.updated = data ? 1 : 0
        response = this.respond(response, opts)

        // afterUpdate lifecycle hook
        op = opts.op = 'afterUpdate'
        return utils.resolve(this[op](mapper, id, props, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Apply the given update to all records that match the selection query.
   * Called by `Mapper#updateAll`.
   *
   * @name Adapter#updateAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The update to apply to the selected records.
   * @param {Object} [query] Selection query.
   * @param {Object} [query.where] Filtering criteria.
   * @param {string|Array} [query.orderBy] Sorting criteria.
   * @param {string|Array} [query.sort] Same as `query.sort`.
   * @param {number} [query.limit] Limit results.
   * @param {number} [query.skip] Offset results.
   * @param {number} [query.offset] Same as `query.skip`.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  updateAll (mapper, props, query, opts) {
    props || (props = {})
    query || (query = {})
    opts || (opts = {})
    let op

    // beforeUpdateAll lifecycle hook
    op = opts.op = 'beforeUpdateAll'
    return utils.resolve(this[op](mapper, props, query, opts))
      .then((_props) => {
        // Allow for re-assignment from lifecycle hook
        props = _props === undefined ? props : _props
        props = withoutRelations(mapper, props, opts)
        op = opts.op = 'updateAll'
        this.dbg(op, mapper, props, query, opts)
        return utils.resolve(this._updateAll(mapper, props, query, opts))
      })
      .then((results) => {
        let [data, result] = results
        data || (data = [])
        result || (result = {})
        let response = new Response(data, result, 'updateAll')
        response.updated = data.length
        response = this.respond(response, opts)

        // afterUpdateAll lifecycle hook
        op = opts.op = 'afterUpdateAll'
        return utils.resolve(this[op](mapper, props, query, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  },

  /**
   * Update the given records in a single batch. Called by `Mapper#updateMany`.
   *
   * @name Adapter#updateMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object[]} records The records to update.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  updateMany (mapper, records, opts) {
    records || (records = [])
    opts || (opts = {})
    let op
    const idAttribute = mapper.idAttribute

    records = records.filter((record) => utils.get(record, idAttribute))

    // beforeUpdateMany lifecycle hook
    op = opts.op = 'beforeUpdateMany'
    return utils.resolve(this[op](mapper, records, opts))
      .then((_records) => {
        // Allow for re-assignment from lifecycle hook
        records = _records === undefined ? records : _records
        records = records.map((record) => withoutRelations(mapper, record, opts))
        op = opts.op = 'updateMany'
        this.dbg(op, mapper, records, opts)
        return utils.resolve(this._updateMany(mapper, records, opts))
      })
      .then((results) => {
        let [data, result] = results
        data || (data = [])
        result || (result = {})
        let response = new Response(data, result, 'updateMany')
        response.updated = data.length
        response = this.respond(response, opts)

        // afterUpdateMany lifecycle hook
        op = opts.op = 'afterUpdateMany'
        return utils.resolve(this[op](mapper, records, opts, response))
          .then((_response) => _response === undefined ? response : _response)
      })
  }
})

/**
 * Create a subclass of this Adapter:
 *
 * @example <caption>Adapter.extend</caption>
 * // Normally you would do: import {Adapter} from 'js-data'
 * const JSData = require('js-data@3.0.0-beta.10')
 * const {Adapter} = JSData
 * console.log('Using JSData v' + JSData.version.full)
 *
 * // Extend the class using ES2015 class syntax.
 * class CustomAdapterClass extends Adapter {
 *   foo () { return 'bar' }
 *   static beep () { return 'boop' }
 * }
 * const customAdapter = new CustomAdapterClass()
 * console.log(customAdapter.foo())
 * console.log(CustomAdapterClass.beep())
 *
 * // Extend the class using alternate method.
 * const OtherAdapterClass = Adapter.extend({
 *   foo () { return 'bar' }
 * }, {
 *   beep () { return 'boop' }
 * })
 * const otherAdapter = new OtherAdapterClass()
 * console.log(otherAdapter.foo())
 * console.log(OtherAdapterClass.beep())
 *
 * // Extend the class, providing a custom constructor.
 * function AnotherAdapterClass () {
 *   Adapter.call(this)
 *   this.created_at = new Date().getTime()
 * }
 * Adapter.extend({
 *   constructor: AnotherAdapterClass,
 *   foo () { return 'bar' }
 * }, {
 *   beep () { return 'boop' }
 * })
 * const anotherAdapter = new AnotherAdapterClass()
 * console.log(anotherAdapter.created_at)
 * console.log(anotherAdapter.foo())
 * console.log(AnotherAdapterClass.beep())
 *
 * @method Adapter.extend
 * @param {Object} [props={}] Properties to add to the prototype of the
 * subclass.
 * @param {Object} [props.constructor] Provide a custom constructor function
 * to be used as the subclass itself.
 * @param {Object} [classProps={}] Static properties to add to the subclass.
 * @returns {Constructor} Subclass of this Adapter class.
 */
