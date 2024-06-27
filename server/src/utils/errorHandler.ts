class errorHandler extends Error {
    public statusCode:Number;
    constructor(message:any,statusCode:Number = 404){
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default errorHandler;