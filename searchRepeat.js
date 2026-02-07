const fs = require('fs');
const Common = require('./common');
const commonInstance = new Common();
const config = require('./config');

class SearchRepeat {
    saveResultRepeat(dataInitial, listRepeat, listNoRepeat, listRepeatMajor, monthSelected, outputPath) {
        // Use outputPath directly - it already contains the simplified year-month structure
        const pathRepeat = outputPath;

        if (!fs.existsSync(pathRepeat)) {
            fs.mkdirSync(pathRepeat, { recursive: true });
        }

        commonInstance.createFile(`${pathRepeat}/repeat${monthSelected}${config.YEAR}.json`, listRepeat);
        commonInstance.createFile(`${pathRepeat}/repeatMajor${monthSelected}${config.YEAR}.json`, listRepeatMajor);
        commonInstance.createFile(`${pathRepeat}/todo${monthSelected}${config.YEAR}NoRepeatOK.json`, listNoRepeat);
        console.log('Resultados repetidos', listRepeat.length);
        console.log('Resultados con fecha mayor', listRepeatMajor.length);
        console.log('Resultados sin repeticiones', listNoRepeat.length);

        this.logFinal(
            pathRepeat,
            monthSelected,
            dataInitial,
            listRepeat.length,
            listRepeatMajor.length,
            listNoRepeat.length
        );

        return {
            listRepeat: listRepeat.length,
            listRepeatMajor: listRepeatMajor.length,
            listNoRepeat: listNoRepeat.length,
        };
    }

    logFinal(pathRepeat, monthSelected, dataInitial, listRepeat, listRepeatMajor, listNoRepeat) {
        const logFinal = {
            'Total resultados iniciales:': dataInitial,
            'Total resultados con repeticiones': listRepeat,
            'Total resultados repetidos más recientes': listRepeatMajor,
            'Total resultados sin repeticiones': listNoRepeat,
        };

        commonInstance.createFile(`${pathRepeat}/logFinal${monthSelected}${config.YEAR}.json`, logFinal);
    }
}
module.exports = SearchRepeat;
