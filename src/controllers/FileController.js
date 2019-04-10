const File = require('../models/File');
const Box = require('../models/Box');


class FileController {
    async store (req, res) {
        const box = await Box.findById(req.params.id);

        const file = await File.create({
            title: req.file.originalname,
            path: req.file.key

        });
        
        box.files.push(file);

        await box.save();

        req.io.sockets.in(box._id).emit('file', file); //pega usuários conectados na box, e envia uma infomração pra eles com o dados do arquivo 

        //criar um arquivo
        return res.json(file);
    }
}

module.exports = new FileController();