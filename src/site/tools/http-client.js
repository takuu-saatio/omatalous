import request from "superagent";
import { canUseDOM } from "fbjs/lib/ExecutionEnvironment";

class HttpClient {
  
  constructor() {
  }

  get(path) {
    
    return new Promise((resolve, reject) => {
      request.get(path)
      .accept("application/json")
      .end((err, res) => {
        if (err) {
          if (err.status === 404) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(res.body);
        }
      });
    });

  }

  post(path, body) {
    return new Promise((resolve, reject) => {
      request.post(path)
      .send(body)
      .accept("application/json")
      .end((err, res) => {
        if (err) {
          if (err.status === 404) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(res.body);
        }
      });
    });
  }

};

export default new HttpClient();
