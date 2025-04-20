class BaseCustomError extends Error {
    statusCode?: number;

    constructor(
        name: string,
        message: string = "An unexpected error occurred",
        statusCode?: number
    ) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class SubjectError extends BaseCustomError {
    constructor(message?: string, statusCode?: number) {
        super("SubjectError", message, statusCode);
    }
}

export class TopicError extends BaseCustomError {
    constructor(message?: string, statusCode?: number) {
        super("TopicError", message, statusCode);
    }
}

export class LessonError extends BaseCustomError {
    constructor(message?: string, statusCode?: number) {
        super("LessonError", message, statusCode);
    }
}

export class AssignmentError extends BaseCustomError {
    constructor(message?: string, statusCode?: number) {
        super("AssignmentError", message, statusCode);
    }
}

export class QuizError extends BaseCustomError {
    constructor(message?: string, statusCode?: number) {
        super("QuizError", message, statusCode);
    }
}
