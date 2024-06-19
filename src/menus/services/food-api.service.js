import http from "../../shared/services/http-common.js";

export class FoodApiService {
    getAll(){
        return http.get("/foods");
    }
    getById(id){
        return http.get(`/foods/${id}`);
    }
    create(foodResource){
        return http.post("/foods", foodResource);
    }
    update(id, foodResource){
        console.log(foodResource);
        console.log(id);
        return http.put(`/foods/${id}`, foodResource);
    }
    delete(id){
        return http.delete(`/foods/${id}`);
    }
}