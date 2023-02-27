/**
 * It takes the body of a request, and returns a promise that resolves to an object containing the
 * body's data
 * @param {Object} ctx - Object - The context object from the request.
 * @returns {
 *   "name": "John",
 *   "age": "30",
 *   "city": "New York"
 * }
 */
export default function bodyParser(ctx: Object): Promise<Object> {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {};
      const data = await ctx.request.body().value;
      const elements = data[Object.getOwnPropertySymbols(data)[0]];
      elements.forEach((element) => (body[element[0]] = element[1]));
      resolve(body);
    } catch (err) {
      reject(err);
    }
  });
}
