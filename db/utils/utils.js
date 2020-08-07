const formatDates = (list, key = 'created_at') => {
    const formArr = list.map((obj) => {
        const newObj = {...obj}
        const timestamp = new Date(newObj[key] * 1000)
        delete newObj[key]
        newObj[key] = timestamp
        return newObj
    })
    return formArr
};

const makeRefObj = (list, key, value) => {
        const newObj = {}
        list.forEach(function(obj){
            newObj[obj[key]] = obj[value]
        })
        return newObj
    };

const renameKeys = (list, keyToChange, newKey) => {
    const output = list.map(function(obj){
        const objCopy = {...obj}
        if (objCopy.hasOwnProperty(keyToChange)) {
            objCopy[newKey] = objCopy[keyToChange]
            delete objCopy[keyToChange]
            return objCopy
        }
    })
    return output
};

const useLookup = (array, refObj, newKey, oldKey) => {
    const newArray = array.map(obj=>{
        const objCopy = {...obj}
        objCopy[newKey] = refObj[objCopy[oldKey]]
        delete objCopy[oldKey]
        return objCopy
    })
    return newArray
}

const formatComments = (comments, articleData) => {
    const corrDates = formatDates(comments, 'created_at')
    const corrAuthors = renameKeys(corrDates, 'created_by', 'author')
    const articleRefObj = makeRefObj(articleData, 'title', 'article_id')
    const corrArticleId = useLookup(corrAuthors, articleRefObj, 'article_id', 'belongs_to')
    return corrArticleId
};

module.exports = {formatDates, makeRefObj, renameKeys, useLookup, formatComments}