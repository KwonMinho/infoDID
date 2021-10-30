const attrs = [
    'cn', 'sn', 'desc', 'privilege', 'didAddress', 'didPhoneNumber',
    'didEmail', 'didJob', 'didCountry', 'didBirth', 'didGender'
]

const checkAttrs = new Map(); 
attrs.forEach((attr)=>{
    checkAttrs.set(attr, true);
});

function checkForm(i){
    let errMsg = '';
    const senderAttrList = Object.keys(i);
    for(let id=0; id<senderAttrList.length; id++){
         const attr  = senderAttrList[id];
         if(checkAttrs.get(attr) != true){
             errMsg += `${attr} is not apply attribute\n`
         }
    }
    return errMsg;
}



const updateForm = (req,res,next)=>{
    const i = req.body.info
    let errMsg = '';
    
    if(i.add == null && i.replace == null && i.delete == null)
        errMsg += "Set one of the 'add', 'replace', or 'delete' attributes on info object. \n";
    
    if(i.add != null)
        errMsg += checkForm(i.add);

    if(i.replace != null)
        errMsg += checkForm(i.replace);

    if(i.delete != null)
        errMsg += checkForm(i.delete);

    if(errMsg != ''){
        res.status(400).json({
            error: errMsg
        });
        return
    }
    next()
}

const addForm = (req,res,next)=>{
    const i = req.body.info
    let errMsg = '';

    if(i.cn == null || i.cn == undefined) errMsg += "Must be 'cn' attribute in InfoObject! \n";
    if(i.sn == null || i.sn == undefined) errMsg += "Must be 'sn' attribute in InfoObject! \n";
    if(i.didGender == null || i.didGender == undefined) errMsg += "Must be 'didGender' attribute in InfoObject! \n";
    if(i.didBirth == null || i.didBirth == undefined) errMsg += "Must be 'didBirth' attribute in InfoObject! \n";
    if(i.didCountry == null || i.didCountry == undefined) errMsg += "Must be 'didCountry' attribute in InfoObject! \n";

    errMsg += checkForm(i);
    if(errMsg != ''){
        res.status(400).json({
            error: errMsg
        });
        return
    }
    next()
 }


 module.exports = {
     addForm,
     updateForm
 }