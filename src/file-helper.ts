export const texFileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(tex)$/)) {
        req.fileValidationError = 'you cant only send .tex files';
        return callback(null , false);
    }
    callback(null, true);
};

export const jsonFileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(json)$/)) {
        req.fileValidationError = 'you cant only send .json files to this endpoint';
        return callback(null , false);
    }
    callback(null, true);
};