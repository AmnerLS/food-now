export class Comment {
    constructor(id, comment, username){
        this.id = id;
        this.comment = comment;
        this.username = username;
    }
    static fromDisplayableComment(displayableComment){
        return new Comment(
            displayableComment.id,
            displayableComment.content,
            'anonymous'
        );
    }
    static toDisplayableComment(comment) {
        return {
            id: comment.id,
            content: comment.comment,
            author: comment.username
        }
    }
}