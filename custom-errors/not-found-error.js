class NotFoundError extends Error{
    constructor(objectType, objectId){
        super(objectType, objectId)
        this.message = `The ${objectType} with id ${objectId} is not found`
        this.code = 404
    }
}

module.exports = NotFoundError