class ApiExceptions extends Error{
    status;
    errors;

    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorizedError(){
        return new ApiExceptions(401, 'User is not authorized');
    }

    static badRequest(message, errors = []){
        return new ApiExceptions(400, message, errors);
    }

    static notFound(){
        return new ApiExceptions(404, 'Not found');
    }
}

module.exports = ApiExceptions;