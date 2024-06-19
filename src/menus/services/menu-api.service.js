import http from "../../shared/services/http-common.js";

export class MenuApiService{
    getAll(){
        return http.get("/menus");
    }
    getById(id){
        return http.get(`/menus/${id}`);
    }

    create(menuResource){
        return http.post("/menus", menuResource);
    }

    update(id, menuResource){
        return http.put(`/menus/${id}`, menuResource);
    }

    delete(id){
        return http.delete(`/menus/${id}`);
    }

    addComment(id, commentResource){
        return http.post(`/menus/${id}/comments`, commentResource);
    }

    addRating(id, ratingResource){
        return http.post(`/menus/${id}/scores`, ratingResource);
    }
}