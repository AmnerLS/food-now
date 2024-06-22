export class Comment {
    constructor(id, comment, username){
        this.id = id;
        this.comment = comment;
        this.username = username;
    }
    static fromDisplayableComment(userName,displayableComment){
        return new Comment(
            displayableComment.id,
            displayableComment,
            userName
        );
    }
    static toDisplayableComment(comment) {
        return {
            id: comment.id,
            comment: comment.comment,
            username: comment.username
        }
    }
}