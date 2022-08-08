/**
 * Use this Reponse Handler to send any express response.
 *   Usage: Response(res).status(503).error("Service is not available").send();
 */

class ReponseHandler {
  constructor(res) {
    if (!res) {
      throw Error(
        "Express Response object is required to initialize Response Handler"
      );
    }
    this.response = res;
    this.statusCode = 200; // default All GOOD
    this.errorMessage = false;
    this.result = undefined;
    this.pagination = undefined;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  body(data) {
    this.result = data;
    return this;
  }
  error(err) {
    this.errorMessage = err;
    return this;
  }

  paginate(pageObj) {
    this.pagination = pageObj;
    return this;
  }

  send() {
    const obj = {
      error: this.errorMessage ?? false,
      result: this.result ?? null,
      pagination: null,
    };

    return this.response.status(this.statusCode).send(obj);
  }
}

const ResponseWrapper = (res) => {
  return new ReponseHandler(res);
};

module.exports = ResponseWrapper;
