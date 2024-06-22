import http from "../../shared/services/http-common.js";

export class UserApiService {
    getById(id) {
        return http.get(`/clients/${id}`);
    }
    addFavorite(id, menuId) {
        return http.put(`/clients/${id}/favorites/${menuId}`);
    }
    deleteFavorite(id, menuId) {
        return http.delete(`/clients/${id}/favorites/${menuId}`);
    }
}