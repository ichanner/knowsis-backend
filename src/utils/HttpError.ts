class HttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
        
        super(message); // Call the parent constructor with the message
      
        this.status = status;
        this.name = this.constructor.name; // Set the error name to the class name

        // Ensure the name of this error is the same as the class name
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export default HttpError;