import http from "../../shared/services/http-common.js";

export class OrderApiService {
    buy(orderResource){
        return http.post("/orders", orderResource);
    }
}