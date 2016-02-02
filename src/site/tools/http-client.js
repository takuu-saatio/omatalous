import request from "superagent";
import { canUseDOM } from "fbjs/lib/ExecutionEnvironment";

class HttpClient {
  
  constructor() {
  }

  _resolveResponse(resolve, err, res) {

    const response = (err && !res.body) ? { status: "error", error: err.message } : res.body;
    resolve(response);
    
  }

  get(path, params) {
    
    return new Promise((resolve, reject) => {
      request.get(path)
      .query(params || {})
      .accept("application/json")
      .end((err, res) => {
        this._resolveResponse(resolve, err, res);
      });
    });

  }

  post(path, body) {
    return new Promise((resolve, reject) => {
      request.post(path)
      .send(body)
      .accept("application/json")
      .end((err, res) => {
        this._resolveResponse(resolve, err, res);
      });
    });
  }
  
  put(path, body) {
    return new Promise((resolve, reject) => {
      request.put(path)
      .send(body)
      .accept("application/json")
      .end((err, res) => {
        this._resolveResponse(resolve, err, res);
      });
    });
  }
  
  delete(path, body) {
    return new Promise((resolve, reject) => {
      request.delete(path)
      .accept("application/json")
      .end((err, res) => {
        this._resolveResponse(resolve, err, res);
      });
    });
  }

};

export default new HttpClient();
