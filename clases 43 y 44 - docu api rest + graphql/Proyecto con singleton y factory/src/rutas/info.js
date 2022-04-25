const { Router } = require('express');
const compression = require('compression');
const path = require('path')

const appDir = path.dirname(require.main.filename);

const routerInfo = Router();

const infoCallback = (res, consolePrint) => {

  const testCompression = 'testCompression...'
  const longString = testCompression.repeat(10000)

  const resultado = {
    "argumentosEntrada": Object.keys(argumentosEntrada).length,
    "NombrePlataforma": process.platform, 
    "VersionNode": process.version, 
    "MemoriaTotalReservada": process.memoryUsage().rss, 
    "PathDeEjecucion": process.execPath, 
    "ProcessId": process.pid, 
    "CarpetaProyecto": appDir,
    "longString": longString
  };
  if (consolePrint) {
    console.log(resultado);
  }

  res.render('info',{resultado, nroProcesadores: require('os').cpus().length });

}

routerInfo.get('/', async (req, res) => {
  req.loggerBase(req)
  infoCallback(res, false);
});

routerInfo.get('/zip', compression(), async (req, res) => {
  req.loggerBase(req)
  infoCallback(res, true);  
});

exports.routerInfo = routerInfo;
