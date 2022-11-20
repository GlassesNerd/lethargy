var Module=typeof Module!="undefined"?Module:{};var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;let toLog=e;err("exiting due to exception: "+toLog)}if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}var fs,nodePath;if(typeof require==="function"){fs=require("fs");nodePath=require("path")}read_=(filename,binary)=>{var ret=tryParseAsDataURI(filename);if(ret){return binary?ret:ret.toString()}filename=nodePath["normalize"](filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror)=>{var ret=tryParseAsDataURI(filename);if(ret){onload(ret)}filename=nodePath["normalize"](filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);if(typeof module!="undefined"){module["exports"]=Module}process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});quit_=(status,toThrow)=>{if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort(text)}}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){{if(Module["onAbort"]){Module["onAbort"](what)}}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;wasmBinaryFile="data:application/octet-stream;base64,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";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(file);if(binary){return binary}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["b"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["g"];addOnInit(Module["asm"]["c"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort("invalid type for getValue: "+type)}return null}function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}function abortOnCannotGrowMemory(requestedSize){abort("OOM")}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;abortOnCannotGrowMemory(requestedSize)}var ASSERTIONS=false;var decodeBase64=typeof atob=="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE=="boolean"&&ENVIRONMENT_IS_NODE){var buf=Buffer.from(s,"base64");return new Uint8Array(buf["buffer"],buf["byteOffset"],buf["byteLength"])}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var asmLibraryArg={"a":_emscripten_resize_heap};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["c"]).apply(null,arguments)};var _init_grass=Module["_init_grass"]=function(){return(_init_grass=Module["_init_grass"]=Module["asm"]["d"]).apply(null,arguments)};var _init_velocity=Module["_init_velocity"]=function(){return(_init_velocity=Module["_init_velocity"]=Module["asm"]["e"]).apply(null,arguments)};var _physic=Module["_physic"]=function(){return(_physic=Module["_physic"]=Module["asm"]["f"]).apply(null,arguments)};Module["getValue"]=getValue;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();