var ini=require('ini');
var fs=require('fs');
module.exports=ini.parse(fs.readFileSync('./config.ini','utf-8'));
