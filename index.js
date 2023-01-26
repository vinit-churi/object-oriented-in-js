class Comment {
    #comments = [];
    constructor(container) {
        let addComment = document.createElement("button");
        addComment.classList.add("addComment");
        addComment.innerText = "addComment";
        let textArea = document.createElement("textarea");
        textArea.id = "mainTextArea";
        this.container = container;
        this.addCommentBtn = addComment;
        this.textArea = textArea;
        this.container.append(this.textArea, this.addCommentBtn);
        this.addCommentBtn.addEventListener("click", (e) => {
            this.addComment(this.textArea.value.trim());
            this.textArea.value = "";
        });
    }
    addComment(commentString) {
        if (commentString === "") return;
        this.#comments.push({
            id: this.generateRandomID(),
            commentText: commentString,
            upvote: 0,
            commentThread: [],
        });
        console.log("comments", this.#comments);
        this.renderComments();
    }
    deleteComment(id) {
        const newCommentList = this.#comments.filter((comment) => {
            if (comment.id === id) {
                return false;
            }
            return true;
        });
        this.#comments = [...newCommentList];
        this.renderComments();
    }
    upvoteCount(id) {
        for (let i = 0; i < this.#comments.length; i++) {
            if (this.#comments[i]["id"] === id) {
                let newCount = Number(this.#comments[i]["upvote"]) + 1;
                this.#comments[i]["upvote"] = newCount;
                document.querySelector(
                    `[data-upvote-btn-id="${id}"]`
                ).dataset.upvoteCount = newCount;
                return null;
            }
        }
    }
    addReply(id) {
        let insertReplyContainer = document.createElement("div");
        let textArea = document.createElement("textarea");
        textArea.dataset.innerCommentTextAreaId = id;
        let insertReply = document.createElement("button");
        insertReply.dataset.insertReplyId = id;
        insertReply.innerText = "Reply to comment";
        let cancelInsertReply = document.createElement("button");
        cancelInsertReply.dataset.cancelInsertReplyId = id;
        cancelInsertReply.innerText = "cancel";
        cancelInsertReply.addEventListener("click", () => {
            this.cancelReply(id);
        });
        insertReply.addEventListener("click", (e) => {
            let id = e.target.dataset.insertReplyId;
            let text = document
                .querySelector(`[data-inner-comment-text-area-id="${id}"]`)
                .value.trim();
            for (let i = 0; i < this.#comments.length; i++) {
                if (this.#comments[i]["id"] === id) {
                    let newCommentThread = [
                        ...Array.from(this.#comments[i]["commentThread"]),
                        text,
                    ];
                    this.#comments[i]["commentThread"] = newCommentThread;
                    break;
                }
            }
            this.cancelReply(id);
            console.log(this.#comments);
            this.renderComments();
        });
        insertReplyContainer.classList.add("insertReplyContainer");
        insertReplyContainer.dataset.insertReplyContainerId = id;
        insertReplyContainer.append(textArea, insertReply, cancelInsertReply);
        let commentRef = document.querySelector(`[data-reply-btn-id="${id}"]`);
        commentRef.insertAdjacentElement("beforeBegin", insertReplyContainer);
    }
    cancelReply(id) {
        document
            .querySelector(`[data-insert-reply-container-id="${id}"]`)
            .remove();
    }
    generateRandomID() {
        let id = "";
        for (let i = 0; i <= 9; i++) {
            id += Math.floor(Math.random() * 9);
        }
        return id;
    }

    renderComments() {
        let commentsThreads = document.querySelectorAll(".commentThread");
        if (commentsThreads != null && commentsThreads.length > 0) {
            Array.from(commentsThreads).forEach((el) => {
                el.remove();
            });
        }
        this.#comments.forEach((comment) => {
            const commentThread = document.createElement("div");
            commentThread.dataset.commentThreadId = comment.id;
            commentThread.classList.add("commentThread");
            const commentEl = document.createElement("div");
            commentEl.innerText = comment.commentText;
            commentEl.dataset.commentId = comment.id;
            commentEl.classList.add("comment");
            const replyBtn = document.createElement("button");
            replyBtn.dataset.replyBtnId = comment.id;
            replyBtn.classList.add("replyBtn");
            const deleteBtn = document.createElement("button");
            deleteBtn.dataset.deleteBtnId = comment.id;
            deleteBtn.classList.add("deleteBtn");
            const upvoteBtn = document.createElement("button");
            upvoteBtn.dataset.upvoteBtnId = comment.id;
            upvoteBtn.dataset.upvoteCount = comment.upvote;
            upvoteBtn.classList.add("upvoteBtn");
            upvoteBtn.innerText = "upvote";
            replyBtn.innerText = "reply";
            deleteBtn.innerText = "delete";
            replyBtn.addEventListener("click", (e) => {
                this.addReply(e.target.dataset.replyBtnId);
            });
            deleteBtn.addEventListener("click", (e) => {
                this.deleteComment(e.target.dataset.deleteBtnId);
            });
            upvoteBtn.addEventListener("click", (e) => {
                this.upvoteCount(e.target.dataset.upvoteBtnId);
            });
            commentThread.append(commentEl);
            if (comment.commentThread.length > 0) {
                comment.commentThread.forEach((innerComment) => {
                    const innerCommentEl = document.createElement("div");
                    innerCommentEl.classList.add("innerCommentEl");
                    innerCommentEl.innerText = innerComment;
                    innerCommentEl.dataset.innerCommentId = comment.id;
                    innerCommentEl.classList.add("innerCommentEl");
                    commentThread.append(innerCommentEl);
                });
            }
            commentThread.append(replyBtn, upvoteBtn, deleteBtn);
            this.textArea.insertAdjacentElement("beforeBegin", commentThread);
        });
    }
}

let container = document.querySelector(".main-textarea");
const comments = new Comment(container);
