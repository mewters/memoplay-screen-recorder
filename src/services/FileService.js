const require = window.require,
    fs = require('fs');

export const FileService = {
    save(buffer, path, name){
        return new Promise((resolve, reject) => {
            const filename = `${path}/${name}`;
            fs.writeFile(filename, buffer, (err) => {
                if(err){
                    reject(err);
                }else{
                    resolve(filename);
                }
            })
        })
    }
};