class Tb{

    static getObjectInArrayFromName(array, objectName){
        let object = null;
        if(objectName !== undefined && objectName !== "") {
            array.forEach(function (objectSeek) {
                if (objectSeek.name === objectName) {
                    object = objectSeek;
                }
            });
        }
        return object;
    }

}