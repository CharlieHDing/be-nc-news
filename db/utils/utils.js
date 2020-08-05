const formatDates = (Array, dateKey = 'created_at') => {
    const formArr = Array.map((Obj) => {
        const objCopy = {...Obj}
        const dateObj = new Date(objCopy[dateKey] * 1000)
        delete objCopy[dateKey]
        objCopy[dateKey] = dateObj
        return objCopy
    })
    return formArr
};

const makeRefObj = (list, key, value) => {
        const newObj = {}
        list.forEach(function(object){
            newObj[object[key]] = object[value]
        })
        return newObj
    };

const renameKeys = (array, keyToChange, newKey) => {
    const output = array.map(function(object){
        const objectCopy = {...object}
        if (objectCopy.hasOwnProperty(keyToChange)) {
            objectCopy[newKey] = objectCopy[keyToChange]
            delete objectCopy[keyToChange]
            return objectCopy
        }
    })
    return output
};

const useLookup = (array, refObj, key) => {
    const newArray = array.map(obj=>{
        const objCopy = {...obj}
        objCopy[key] = refObj[objCopy.belongs_to]
        delete objCopy.belongs_to
        return objCopy
    })
    return newArray
}

const formatComments = (comments, articleData) => {
    const corrDates = formatDates(comments, 'created_at')
    const corrAuthors = renameKeys(corrDates, 'created_by', 'author')
    const articleRefObj = makeRefObj(articleData, 'title', 'article_id')
    const corrArticleId = useLookup(corrAuthors, articleRefObj, 'article_id')
    return corrArticleId
};

module.exports = {formatDates, makeRefObj, renameKeys, useLookup, formatComments}